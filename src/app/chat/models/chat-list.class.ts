import { insertIndex } from 'src/app/shared/utils/shared.utils';
import { ChatItem, ChatList as ChatListType } from './chat.interfaces';

export class ChatList implements ChatListType {
  readonly chats: ChatItem[] = [];

  constructor(...chats: ChatItem[]) {
    this.chats = chats || [];
  }

  get length(): number {
    return this.chats.length;
  }

  find(chatSid: string): ChatItem {
    return this.chats.find((chat) => chat.sid === chatSid);
  }

  add(...chats: ChatItem[]) {
    chats.forEach((chat) => (this.replace(chat) ? null : this.insert(chat)));
  }

  replace(chat: ChatItem): boolean {
    const index = this.chats.findIndex((chat$) => chat$.sid === chat.sid);

    if (index > -1) {
      this.chats.splice(index, 1);
      this.insert(chat);

      return true;
    } else {
      return false;
    }
  }

  insert(chat: ChatItem) {
    const pivot = insertIndex(
      chat,
      this.chats,
      (chat1: ChatItem, chat2: ChatItem) =>
        chat1.time.getTime() > chat2.time.getTime()
    );

    this.chats.splice(pivot, 0, chat);
  }
}
