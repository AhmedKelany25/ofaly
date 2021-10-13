import { PhoneNumber } from 'libphonenumber-js/mobile';

import { MessageItem } from '../models/message.interfaces';
import { Channel, ChatItem } from '../models/chat.interfaces';

interface CustomFriendlyName {
  customName: string;
}

export function extractPhoneNumber(
  friendlyName: string,
  myPhoneNumber: PhoneNumber
): string {
  const phoneNumber = myPhoneNumber.number as string;

  try {
    const friendlyName$: CustomFriendlyName = JSON.parse(friendlyName);
    const phoneNumbers: string[] = friendlyName$.customName.split('&');
    const otherPhoneNumber = phoneNumbers.every(
      (number: string) => number === phoneNumber
    )
      ? phoneNumber
      : phoneNumbers.find((number: string) => number !== phoneNumber);

    return otherPhoneNumber;
  } catch {
    return friendlyName;
  }
}

function isGroupChat(channel: Channel): boolean {
  try {
    const attributes = JSON.parse(channel.attributes);
    return attributes.group || false;
  } catch {
    return false;
  }
}

export function toChatItem(
  channel: Channel,
  options: {
    title?: string;
    message?: MessageItem;
    unreadMessagesCount?: number;
    avatar?: string;
  } = {}
): ChatItem {
  const group = isGroupChat(channel);
  const avatar = options.avatar
    ? options.avatar
    : group
    ? 'assets/icon/chat/group-avatar.svg'
    : 'assets/icon/chat/single-avatar.svg';

  return {
    sid: channel.sid,
    avatar: avatar,
    title: options.title || channel.friendly_name,
    message: options.message ? setLastMessage(options.message, group) : '',
    time: new Date(
      options.message ? options.message.time : channel.date_updated
    ),
    unreadCount: options.unreadMessagesCount,
    messageCount: channel.messages_count,
    group: group,
  };
}

export function setLastMessage(message: MessageItem, group: boolean): string {
  return (group ? `${message.sender.name.split(' ')[0]}: ` : '') + message.body;
}

export function toUniqueName(...phoneNumbers: PhoneNumber[]): string {
  return phoneNumbers
    .map((number) => number.number as string)
    .sort()
    .join('&');
}
