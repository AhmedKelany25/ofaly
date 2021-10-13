import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  EMPTY,
  forkJoin,
  from,
  Observable,
  of,
  Subject,
} from 'rxjs';
import {
  concatMap,
  map,
  mergeMap,
  pluck,
  switchMap,
  tap,
  toArray,
} from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import { PhoneNumber } from 'libphonenumber-js';
import { v4 as uuid4 } from 'uuid';

import { NetworkState, RequestState } from 'src/app/shared/models/shared.enums';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ChatUrlBuilder } from 'src/app/shared/url.builder';
import {
  Message,
  MessageItem,
  Messages,
  MessageStatus,
  OutgoingMessage,
  ChatMessages as ChatMessagesType,
  PendingMessageItem,
  PersistedMessages,
} from '../models/message.interfaces';
import { ChatMessages } from '../models/message.classes';
import {
  persistedMessagesFromJSON,
  persistedMessagesToJSON,
  toMessageItem,
  toOutgoingMessage,
  toPendingMessageItem,
  toSentMessageItem,
} from '../utils/message.utils';
import { ContactsService } from 'src/app/contacts/services/contacts.service';
import { PhoneContact } from 'src/app/contacts/models/contacts.interfaces';
import { NetworkService } from 'src/app/shared/services/network.service';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

const PENDING_MESSAGES: string = 'pendingMessages';

interface LastMessage {
  chatSid: string;
  message: MessageItem;
}

type ChatMap<T> = Map<string, T>;

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly phoneNumber$: string;
  private readonly lastMessage$: Subject<LastMessage> = new Subject();
  private readonly chatRooms$: ChatMap<ChatMessagesType> = new Map();
  private readonly requestState: ChatMap<{
    send: RequestState;
    fetch: RequestState;
  }> = new Map();

  private socket: WebSocketSubject<any>;

  readonly pageSize: number = 50;

  constructor(
    private httpClient: HttpClient,
    private chatUrl: ChatUrlBuilder,
    private authService: AuthService,
    private contactsService: ContactsService,
    private networkService: NetworkService
  ) {
    this.phoneNumber$ = this.authService.phoneNumber.number as string;

    this.networkService.trackNetworkState().subscribe((state) => {
      if (state === NetworkState.online) {
        this.sendPendingMessages().subscribe();
        if (authService.chatJwt) this.connectToWebSocket();
      }
    });
  }

  get lastMessage(): Observable<LastMessage> {
    return this.lastMessage$.pipe();
  }

  private emitLastMessage(chatSid: string) {
    this.lastMessage$.next({
      chatSid: chatSid,
      message: this.chatRooms$.get(chatSid).last,
    });
  }

  private addToChatMessages$(chatSid: string, messages: MessageItem[]) {
    this.chatRooms$.has(chatSid)
      ? this.chatRooms$
          .get(chatSid)
          .add(...messages.map((message) => ({ message })))
      : this.chatRooms$.set(chatSid, new ChatMessages(chatSid, messages));
  }

  private addMessageItem$(message: MessageItem, uid: string = null) {
    const chatSid = message.chatSid;

    this.chatRooms$.has(chatSid)
      ? this.chatRooms$.get(chatSid).add({ message, uid })
      : this.chatRooms$.set(chatSid, new ChatMessages(chatSid, [message]));

    this.emitLastMessage(chatSid);
  }

  private setFetchState(chatSid: string, state: RequestState) {
    if (this.requestState.has(chatSid)) {
      this.requestState.get(chatSid).fetch = state;
    } else {
      this.requestState.set(chatSid, { send: RequestState.idle, fetch: state });
    }
  }

  private setSendState(chatSid: string, state: RequestState) {
    if (this.requestState.has(chatSid)) {
      this.requestState.get(chatSid).send = state;
    } else {
      this.requestState.set(chatSid, { send: state, fetch: RequestState.idle });
    }
  }

  private getContactName(phoneNumber: string): Observable<string> {
    if (phoneNumber === this.phoneNumber$) {
      return of('You');
    }

    const contactObservable = this.contactsService.fetchContact(phoneNumber);

    return contactObservable
      ? contactObservable.pipe(
          map((contact: PhoneContact) => (contact ? contact.name : phoneNumber))
        )
      : of(phoneNumber);
  }

  private toMessageItem(message: Message): Observable<MessageItem> {
    return this.getContactName(message.from).pipe(
      map((name: string) =>
        toMessageItem(message, name, MessageStatus.incoming)
      )
    );
  }

  private getMessageStatus(phoneNumber: PhoneNumber): MessageStatus {
    return this.authService.phoneNumber.isEqual(phoneNumber)
      ? MessageStatus.sent
      : MessageStatus.incoming;
  }

  private getNextPage(chatSid: string): number {
    const pageSize = this.chatRooms$.has(chatSid)
      ? this.chatRooms$.get(chatSid).length
      : 0;
    const nextPage$ = Math.floor(pageSize / this.pageSize);

    return nextPage$;
  }

  private readPendingMessages(): Observable<PersistedMessages> {
    return from(Storage.get({ key: PENDING_MESSAGES })).pipe(
      pluck<{ value: string }, string>('value'),
      map<string, PersistedMessages>((data) =>
        data ? persistedMessagesFromJSON(data) : new Map()
      )
    );
  }

  private writePendingMessages(messages: PersistedMessages): Observable<void> {
    return from(
      Storage.set({
        key: PENDING_MESSAGES,
        value: persistedMessagesToJSON(messages),
      })
    );
  }

  private addPendingMessage(chatSid: string, message: OutgoingMessage) {
    const pendingMessage = toPendingMessageItem(chatSid, message);

    this.readPendingMessages()
      .pipe(
        map((chatsMessages) => {
          if (chatsMessages.has(chatSid)) {
            chatsMessages.get(chatSid).push(pendingMessage);
          } else {
            chatsMessages.set(chatSid, [pendingMessage]);
          }

          return chatsMessages;
        }),
        switchMap((chatsMessages) => this.writePendingMessages(chatsMessages))
      )
      .subscribe();
  }

  private removePendingMessage(chatSid: string, uid: string) {
    this.readPendingMessages()
      .pipe(
        map((chatsMessages) => {
          if (chatsMessages.has(chatSid)) {
            const messages = chatsMessages
              .get(chatSid)
              .filter((msg) => msg.sid !== uid);

            if (messages.length) {
              chatsMessages.set(chatSid, messages);
            } else {
              chatsMessages.delete(chatSid);
            }
          }

          return chatsMessages;
        }),
        switchMap((chatsMessages) => this.writePendingMessages(chatsMessages))
      )
      .subscribe();
  }

  private fetchMessage(messageUrl: string): Observable<MessageItem> {
    return this.httpClient
      .get<Message>(messageUrl)
      .pipe(switchMap((message) => this.toMessageItem(message)));
  }

  private sendMessage$(
    chatSid: string,
    message: OutgoingMessage
  ): Observable<MessageItem> {
    return this.httpClient
      .post<Message>(this.chatUrl.message(chatSid), message)
      .pipe(
        switchMap((message: Message) =>
          this.getContactName(message.from).pipe(
            map((name: string) => toSentMessageItem(message, name))
          )
        )
      );
  }

  private fetchPendingMessages(
    chatSid: string
  ): Observable<PendingMessageItem[]> {
    return this.readPendingMessages().pipe(
      switchMap((chatsMessages) =>
        from(chatsMessages.has(chatSid) ? chatsMessages.get(chatSid) : [])
      ),
      toArray()
    );
  }

  private sendPendingMessages(): Observable<ChatMap<MessageItem[]>> {
    return this.readPendingMessages().pipe(
      switchMap((chatsMessages) => from(chatsMessages)),
      tap(([chatSid, _]) => this.setSendState(chatSid, RequestState.ongoing)),
      mergeMap(([chatSid, messages]) =>
        from(messages).pipe(
          concatMap((message) =>
            this.sendMessage$(chatSid, toOutgoingMessage(message)).pipe(
              tap((message$: MessageItem) => {
                this.addMessageItem$(message$, message.sid);
                this.removePendingMessage(chatSid, message.sid);
              })
            )
          ),
          toArray(),
          tap({
            error: (_) => this.setSendState(chatSid, RequestState.failed),
            complete: () => this.setSendState(chatSid, RequestState.done),
          }),
          map((messages) => [chatSid, messages])
        )
      ),
      toArray(),
      map((chatsMessages: [string, MessageItem[]][]) => new Map(chatsMessages))
    );
  }

  connectToWebSocket() {
    if (!this.socket || this.socket.closed) {
      this.socket = webSocket(this.chatUrl.webSocket(this.phoneNumber$));
      this.socket
        .pipe(
          mergeMap((message: Message) => {
            let uid: string = null;

            try {
              uid = JSON.parse(message.attributes).uid;
            } catch {}

            return this.toMessageItem(message).pipe(
              tap((message) => this.addMessageItem$(message, uid))
            );
          })
        )
        .subscribe();
    }
  }

  getFetchState(chatSid: string): RequestState {
    return this.requestState.has(chatSid)
      ? this.requestState.get(chatSid).fetch
      : RequestState.idle;
  }

  getChatMessages(chatSid: string): MessageItem[] {
    const chatMessage = this.chatRooms$.get(chatSid);
    return chatMessage ? chatMessage.messages : null;
  }

  setDraft(chatSid: string, value: string) {
    if (this.chatRooms$.has(chatSid))
      this.chatRooms$.get(chatSid).draft = value;
  }

  getDraft(chatSid: string): string {
    return this.chatRooms$.has(chatSid)
      ? this.chatRooms$.get(chatSid).draft || ''
      : '';
  }

  fetchLastMessage(
    chatSid: string,
    messageUrl: string
  ): Observable<MessageItem> {
    return forkJoin([
      this.fetchPendingMessages(chatSid).pipe(
        map((messages) => {
          return messages.length ? messages[messages.length - 1] : null;
        })
      ),
      this.fetchMessage(messageUrl),
    ]).pipe(
      map(([msg1, msg2]) =>
        msg1 && msg1.time.getTime() > msg2.time.getTime() ? msg1 : msg2
      )
    );
  }

  fetchMessageItems(chatSid: string): Observable<MessageItem[]> {
    this.setFetchState(chatSid, RequestState.ongoing);

    // Creating query params
    let params = new HttpParams();
    params = params.append('order', 'desc');
    params = params.append('page', `${this.getNextPage(chatSid)}`);
    params = params.append('page_size', `${this.pageSize}`);

    // Get messages
    return this.httpClient
      .get(this.chatUrl.message(chatSid), { params: params })
      .pipe(
        pluck<Messages, Message[]>('messages'),
        map((messages: Message[]) => messages.reverse()),
        switchMap((messages: Message[]) => from(messages)),
        mergeMap((message: Message) => this.toMessageItem(message)),
        toArray(),
        switchMap((messages) =>
          this.fetchPendingMessages(chatSid).pipe(
            map((pendingMessages) => messages.concat(pendingMessages))
          )
        ),
        tap({
          next: (messages: MessageItem[]) =>
            this.addToChatMessages$(chatSid, messages),
          error: (_) => this.setFetchState(chatSid, RequestState.failed),
          complete: () => this.setFetchState(chatSid, RequestState.done),
        })
      );
  }

  sendMessage(chatSid: string): Observable<MessageItem> {
    const body = this.getDraft(chatSid).trim();

    if (body) {
      // Create outgoing message
      const uid: string = uuid4();
      const message: OutgoingMessage = {
        attributes: JSON.stringify({ uid: uid }),
        from: this.phoneNumber$,
        body: body,
      };

      // Adde to chat messages as pending
      this.addMessageItem$(toPendingMessageItem(chatSid, message));

      // Clear out the chat draft
      this.setDraft(chatSid, null);

      // Send message
      if (this.networkService.networkState === NetworkState.offline) {
        this.addPendingMessage(chatSid, message);

        return EMPTY;
      }

      return this.sendMessage$(chatSid, message).pipe(
        tap({
          next: (message: MessageItem) => this.addMessageItem$(message, uid),
          error: (error) => {
            error.status === 0 &&
            this.networkService.networkState === NetworkState.offline
              ? this.addPendingMessage(chatSid, message)
              : console.log(
                  `!!! ${JSON.stringify(error)} \n>>> ${
                    this.networkService.networkState
                  }`
                );
          },
        })
      );
    } else {
      // In case a send message attempt was made with an empty body
      console.error('Sending message with empty body\n', [
        this.chatRooms$.get(chatSid),
      ]);

      return EMPTY;
    }
  }
}
