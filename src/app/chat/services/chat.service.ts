import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
  map,
  mergeMap,
  switchMap,
  tap,
  toArray,
  pluck,
  catchError,
  mapTo,
} from 'rxjs/operators';
import { Observable, of, EMPTY, from } from 'rxjs';

import { PhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

import { ChatUrlBuilder } from 'src/app/shared/url.builder';
import { PhoneContact } from 'src/app/contacts/models/contacts.interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';
import { RequestState } from 'src/app/shared/models/shared.enums';
import { ContactsService } from 'src/app/contacts/services/contacts.service';
import { MessageItem } from '../models/message.interfaces';
import {
  extractPhoneNumber,
  setLastMessage,
  toChatItem,
  toUniqueName,
} from '../utils/chat.utils';
import {
  Channel,
  ChannelCreate,
  ChatItem,
  ChatList as ChatListType,
  ChatType,
  GroupChat,
  UserChannel,
  UserChannels,
} from '../models/chat.interfaces';
import { ChatList } from '../models/chat-list.class';
import { MemberService } from './member.service';
import { MessageService } from './message.service';
import { User } from '../models/member.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly phoneNumber$: string;

  private pageSize$: number = 50;
  private chatList$: ChatListType = new ChatList();
  private requestState$: { fetch: RequestState; create: RequestState } = {
    fetch: RequestState.idle,
    create: RequestState.idle,
  };

  constructor(
    private httpClient: HttpClient,
    private chatUrl: ChatUrlBuilder,
    private authService: AuthService,
    private memberService: MemberService,
    private messageService: MessageService,
    private contactsService: ContactsService,
    private router: Router
  ) {
    this.phoneNumber$ = this.authService.phoneNumber.number as string;

    this.messageService.lastMessage.subscribe((data) =>
      data.message ? this.updateLastMessage(data.chatSid, data.message) : null
    );
  }

  private get nextPage(): number {
    const pageSize = this.chatList$ ? this.chatList$.length : 0;
    const nextPage$ = Math.floor(pageSize / this.pageSize);

    return nextPage$;
  }

  get pageSize(): number {
    return this.pageSize$;
  }

  get chatItems(): ChatItem[] {
    return this.chatList$.chats;
  }

  get fetchState(): RequestState {
    return this.requestState$.fetch;
  }

  get createState(): RequestState {
    return this.requestState$.create;
  }

  private updateLastMessage(chatSid: string, message: MessageItem) {
    const chat: ChatItem = this.chatList$.find(chatSid);

    if (chat) {
      chat.message = setLastMessage(message, chat.group);
      chat.time = message.time;

      if (!this.authService.phoneNumber.isEqual(message.sender.identity)) {
        chat.unreadCount++;
      }

      this.chatList$.add(chat);
    } else {
      this.fetchChat(chatSid).subscribe((chat) => {
        this.chatList$.add(chat);
      });
    }
  }

  private fetchChatItem$(userChannel: UserChannel): Observable<ChatItem> {
    return this.httpClient.get<Channel>(userChannel.links.channel).pipe(
      switchMap((channel: Channel) =>
        channel.links.last_message
          ? this.messageService
              .fetchLastMessage(channel.sid, channel.links.last_message)
              .pipe(map((message: MessageItem) => [message, channel]))
          : of([null, channel])
      ),
      switchMap(([message, channel]: [MessageItem, Channel]) => {
        return this.getContactName(channel.friendly_name).pipe(
          map((name: string) =>
            toChatItem(channel, {
              title: name,
              message: message,
              unreadMessagesCount: userChannel.unread_messages_count,
            })
          )
        );
      })
    );
  }

  private getContactName(friendlyName: string): Observable<string> {
    const name = extractPhoneNumber(friendlyName, this.authService.phoneNumber);

    return name === this.phoneNumber$
      ? of('You')
      : name === friendlyName
      ? of(name)
      : this.contactsService
          .fetchContact(name)
          .pipe(map((contact) => (contact ? contact.name : name)));
  }

  private createSingleChat(phoneNumber: PhoneNumber): Observable<ChatItem> {
    const uniqueName = toUniqueName(this.authService.phoneNumber, phoneNumber);

    const body: ChannelCreate = {
      attributes: '{}',
      created_by: this.phoneNumber$,
      friendly_name: JSON.stringify({ customName: uniqueName }),
      unique_name: uniqueName,
      type: ChatType.private,
    };

    return this.httpClient.post<Channel>(this.chatUrl.channel(), body).pipe(
      switchMap((channel: Channel) =>
        this.getContactName(channel.friendly_name).pipe(
          map((name: string) => toChatItem(channel, { title: name }))
        )
      ),
      tap((chatItem: ChatItem) => this.chatList$.add(chatItem)),
      switchMap((chatItem: ChatItem) =>
        this.memberService
          .addMembers(chatItem.sid, [this.authService.phoneNumber, phoneNumber])
          .pipe(mapTo(chatItem))
      )
    );
  }

  private fetchSingleChat(phoneNumber: PhoneNumber): Observable<ChatItem> {
    const uniqueName = toUniqueName(this.authService.phoneNumber, phoneNumber);

    return this.fetchChat(uniqueName);
  }

  contactSubmitHandler() {
    this.contactsService.onSubmitSingleContact((contact: PhoneContact) => {
      const phoneNumber: PhoneNumber = contact.phoneNumber;

      return this.fetchSingleChat(phoneNumber).pipe(
        catchError((error) =>
          error.status === 404 ? this.createSingleChat(phoneNumber) : EMPTY
        ),
        tap((chat) =>
          this.router.navigate([`chat/${chat.sid}`], { replaceUrl: true })
        )
      );
    });

    this.contactsService.onSubmitMultipleContacts(
      (contacts: PhoneContact[]) => {
        return from(
          this.router.navigate(['chat/group'], {
            state: { contacts },
          })
        );
      }
    );
  }

  getChatItem(chatSid: string): ChatItem {
    return this.chatList$.find(chatSid);
  }

  isCached(chatSid: string): boolean {
    return this.messageService.getChatMessages(chatSid) ? true : false;
  }

  fetchChatItems(): Observable<ChatItem[]> {
    this.requestState$.fetch = RequestState.ongoing;

    // Creating query params
    let params = new HttpParams();
    params = params.append('page', `${this.nextPage}`);
    params = params.append('page_size', `${this.pageSize}`);

    // Get chats
    return this.httpClient
      .get<UserChannels>(this.chatUrl.userChannel(this.phoneNumber$), {
        params: params,
      })
      .pipe(
        pluck<UserChannels, UserChannel[]>('channels'),
        mergeMap((channels: UserChannel[]) => from(channels)),
        mergeMap((channel: UserChannel) => this.fetchChatItem$(channel)),
        toArray(),
        tap({
          next: (chatItems: ChatItem[]) => {
            this.chatList$.add(...chatItems);
            this.requestState$.fetch = RequestState.done;
          },
          error: (_) => (this.requestState$.fetch = RequestState.failed),
        })
      );
  }

  fetchChat(chatSid: string): Observable<ChatItem> {
    return this.httpClient
      .get<Channel>(this.chatUrl.channel(chatSid))
      .pipe(
        switchMap((channel: Channel) =>
          this.getContactName(channel.friendly_name).pipe(
            map((name: string) => toChatItem(channel, { title: name }))
          )
        )
      );
  }

  createInitChats(): Observable<ChatItem[]> {
    return this.contactsService.fetchContacts().pipe(
      switchMap((contacts: PhoneContact[]) =>
        this.memberService.fetchUsers(
          contacts.map((contact) => contact.phoneNumber)
        )
      ),
      switchMap((users: User[]) => from(users)),
      mergeMap((user: User) =>
        this.fetchSingleChat(parsePhoneNumber(user.identity)).pipe(
          catchError((error) =>
            error.status === 404
              ? this.createSingleChat(parsePhoneNumber(user.identity))
              : EMPTY
          )
        )
      ),
      toArray()
    );
  }

  createGroupChat(groupChat: GroupChat): Observable<ChatItem> {
    this.requestState$.create = RequestState.ongoing;

    const attributes = { avatar: '', group: true };
    const body: ChannelCreate = {
      attributes: JSON.stringify(attributes),
      created_by: this.phoneNumber$,
      friendly_name: groupChat.name,
      type: ChatType.private,
    };

    return this.httpClient.post(this.chatUrl.channel(), body).pipe(
      map((channel: Channel) =>
        toChatItem(channel, { avatar: attributes.avatar })
      ),
      tap((chatItem: ChatItem) => this.chatList$.add(chatItem)),
      switchMap((chatItem: ChatItem) =>
        this.memberService
          .addMembers(chatItem.sid, [
            this.authService.phoneNumber,
            ...groupChat.members.map((member) => member.phoneNumber),
          ])
          .pipe(mapTo(chatItem))
      ),
      tap({
        next: (_) =>
          setTimeout(
            () => (this.requestState$.create = RequestState.done),
            1000
          ),
        error: (_) => (this.requestState$.create = RequestState.failed),
      })
    );
  }
}
