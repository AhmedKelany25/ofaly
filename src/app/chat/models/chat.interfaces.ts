import { PhoneContact } from 'src/app/contacts/models/contacts.interfaces';
import { Meta } from '../../shared/models/shared.interfaces';

export interface UserChannelLinks {
  channel: string;
  member: string;
}

export interface UserChannel {
  channel_sid: string;
  last_consumed_message_index: number;
  links: UserChannelLinks;
  member_sid: string;
  notification_level: string;
  service_sid: string;
  status: string;
  unread_messages_count: number;
  url: string;
  user_sid: string;
}

export interface UserChannels {
  meta: Meta;
  channels: UserChannel[];
}

export interface ChannelLinks {
  webhooks: string;
  messages: string;
  invites: string;
  members: string;
  last_message: string;
}

export enum ChatType {
  public = 'public',
  private = 'private',
}

export interface ChannelCreate {
  attributes: string;
  created_by: string;
  friendly_name: string;
  unique_name?: string;
  type: ChatType;
}

export interface Channel extends ChannelCreate {
  date_created: Date;
  date_updated: Date;
  links: ChannelLinks;
  members_count: number;
  messages_count: number;
  service_sid: string;
  sid: string;
  unique_name: string;
  url: string;
}

export interface ChatItem {
  readonly sid: string;
  avatar: string;
  title: string;
  message: string;
  time: Date;
  unreadCount: number;
  messageCount: number;
  readonly group: boolean;
}

export interface GroupChat {
  name?: string;
  avatar?: string;
  members: PhoneContact[];
}

export interface ChatList {
  readonly chats: ChatItem[];
  length: number;
  find: (chatSid: string) => ChatItem;
  add: (...chats: ChatItem[]) => void;
  replace: (chats: ChatItem) => boolean;
  insert: (chats: ChatItem) => void;
}

export interface Subscribe {
  next?: (value: any) => void;
  error?: (error: any) => void;
  complete?: () => void;
}
