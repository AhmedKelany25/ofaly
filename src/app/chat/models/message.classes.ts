import { insertIndex } from 'src/app/shared/utils/shared.utils';
import {
  MessageItem,
  ChatMessages as ChatMessagesType,
} from './message.interfaces';

export class ChatMessages implements ChatMessagesType {
  readonly chatSid: string;
  private messages$: MessageItem[];
  draft: string;

  constructor(chatSid: string, messages: MessageItem[]) {
    this.chatSid = chatSid;
    this.messages$ = messages || [];
  }

  get messages(): MessageItem[] {
    return this.messages$;
  }

  get length(): number {
    return this.messages$.length;
  }

  get last(): MessageItem {
    return this.length ? this.messages$[this.length - 1] : null;
  }

  add(...messages: { message: MessageItem; uid?: string }[]) {
    const allMessages = [...this.messages$];

    messages.forEach((msg) => {
      let index = allMessages.findIndex(
        (message) => message.sid === msg.uid || message.sid === msg.message.sid
      );

      if (index > -1) {
        allMessages.splice(index, 1, msg.message);
      } else {
        const pivot = insertIndex(
          msg.message,
          allMessages,
          (msg1: MessageItem, msg2: MessageItem) =>
            msg1.time.getTime() < msg2.time.getTime()
        );

        allMessages.splice(pivot, 0, msg.message);
      }
    });

    this.messages$ = allMessages;
  }

  replace(message: MessageItem, uid: string = null): number {
    const index = this.messages$.findIndex(
      (msg) => msg.sid === uid || msg.sid === message.sid
    );

    if (index > -1) {
      this.messages$.splice(index, 1);
      this.insert(message);
    }

    return index;
  }

  insert(message: MessageItem) {
    const pivot = insertIndex(
      message,
      this.messages$,
      (msg1: MessageItem, msg2: MessageItem) =>
        msg1.time.getTime() < msg2.time.getTime()
    );

    this.messages$.splice(pivot, 0, message);
  }
}
