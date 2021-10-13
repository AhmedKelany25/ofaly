import { PhoneNumber } from 'libphonenumber-js/mobile';
import { Meta } from 'src/app/shared/models/shared.interfaces';

export enum MessageStatus {
  incoming = 'incoming',
  pending = 'pending',
  sent = 'sent',
  received = 'received',
  seen = 'seen',
}

export interface MessageAttributes {
  uid: string;
}

export interface Message {
  attributes: string;
  body: string;
  channel_sid: string;
  date_created: Date;
  date_updated: Date;
  from: string;
  index: number;
  last_updated_by: string;
  service_sid: string;
  sid: string;
  to: string;
  type: string;
  url: string;
  was_edited: boolean;
}

export interface OutgoingMessage {
  attributes: string;
  from: string;
  body: string;
}

export interface Messages {
  messages: Message[];
  meta: Meta;
}

export interface Sender {
  name: string;
  identity: PhoneNumber;
}

export interface MessageItem {
  sid: string;
  chatSid: string;
  avatar: string;
  sender: Sender;
  body: string;
  time: Date;
  status: MessageStatus;
}

export interface PendingMessageItem extends MessageItem {
  status: MessageStatus.pending;
}

export interface SentMessageItem extends MessageItem {
  status: MessageStatus.sent;
}

export interface ChatMessages {
  readonly chatSid: string;
  readonly messages: MessageItem[];
  draft?: string;
  length: number;
  last: MessageItem;
  add: (...messages: { message: MessageItem; uid?: string }[]) => void;
  replace: (message: MessageItem, uid?: string) => number;
  insert: (message: MessageItem) => void;
}

export type PersistedMessages = Map<string, PendingMessageItem[]>;
