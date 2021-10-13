import { parsePhoneNumber } from 'libphonenumber-js/mobile';
import { unifyTime } from 'src/app/shared/utils/shared.utils';
import {
  Message,
  MessageItem,
  MessageStatus,
  OutgoingMessage,
  PendingMessageItem,
  PersistedMessages,
  Sender,
  SentMessageItem,
} from '../models/message.interfaces';

export function toMessageItem(
  message: Message,
  sender: string,
  status: MessageStatus
): MessageItem {
  return {
    sid: message.sid,
    chatSid: message.channel_sid,
    avatar: '',
    sender: { name: sender, identity: parsePhoneNumber(message.from) },
    body: message.body,
    time: new Date(message.date_created),
    status: status,
  };
}

export function toPendingMessageItem(
  chatSid: string,
  message: OutgoingMessage
): PendingMessageItem {
  return {
    sid: JSON.parse(message.attributes).uid as string,
    chatSid: chatSid,
    avatar: '',
    sender: { name: 'You', identity: parsePhoneNumber(message.from) },
    body: message.body,
    time: new Date(),
    status: MessageStatus.pending,
  };
}

function messageItemToJSON(message: PendingMessageItem) {
  return {
    sid: message.sid,
    chatSid: message.chatSid,
    avatar: message.avatar,
    sender: {
      name: message.sender.name,
      identity: message.sender.identity.number,
    },
    body: message.body,
    time: message.time,
    status: message.status,
  };
}

export function persistedMessagesToJSON(
  chatsMessages: PersistedMessages
): string {
  const chatsMessages$: any[][] = [];

  chatsMessages.forEach((messages, chatSid) => {
    let chatMessages: any[] = [];

    messages.forEach((message) =>
      chatMessages.push(messageItemToJSON(message))
    );

    chatsMessages$.push([chatSid, chatMessages]);
  });

  return JSON.stringify(chatsMessages$);
}

export function persistedMessagesFromJSON(data: string): PersistedMessages {
  const chatsMessages: Map<string, any[]> = new Map(JSON.parse(data));

  chatsMessages.forEach((messages, _) => {
    messages.forEach((message) => {
      message.time = new Date(message.time);
      message.sender.identity = parsePhoneNumber(message.sender.identity);
    });
  });

  return chatsMessages;
}

export function toSentMessageItem(
  message: Message,
  sender: string
): SentMessageItem {
  return {
    sid: message.sid,
    chatSid: message.channel_sid,
    avatar: '',
    sender: { name: sender, identity: parsePhoneNumber(message.from) },
    body: message.body,
    time: new Date(message.date_created),
    status: MessageStatus.sent,
  };
}

export function toOutgoingMessage(
  message: PendingMessageItem
): OutgoingMessage {
  return {
    attributes: JSON.stringify({ uid: message.sid }),
    from: message.sender.identity.number as string,
    body: message.body,
  };
}

function areClose(msg1: { time: Date }, msg2: { time: Date }): boolean {
  return Math.abs(msg1.time.getTime() - msg2.time.getTime()) < 3e5;
}

function sameDay(msg1: { time: Date }, msg2: { time: Date }): boolean {
  return unifyTime(msg1.time).getTime() === unifyTime(msg2.time).getTime();
}

function sameSender(
  msg1: { sender: Sender },
  msg2: { sender: Sender }
): boolean {
  return msg1.sender.identity.isEqual(msg2.sender.identity);
}

export function canMerge(
  msg1: { sender: Sender; time: Date },
  msg2: { sender: Sender; time: Date }
): boolean {
  return sameSender(msg1, msg2) && areClose(msg1, msg2) && sameDay(msg1, msg2);
}
