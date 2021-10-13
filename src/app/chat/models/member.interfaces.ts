import { Meta } from 'src/app/shared/models/shared.interfaces';

export interface MemberCreate {
  identity: string;
  attributes: string;
}

export interface Member extends MemberCreate {
  role_sid: string;
  date_created: Date;
  date_updated: Date;
  last_consumed_message_index: number;
  last_consumption_timestamp: Date;
  sid: string;
  service_sid: string;
  channel_sid: string;
  url: string;
}

export interface UserCreate {
  friendly_name: string;
  identity: string;
  attributes: string;
}

interface UserLinks {
  user_channels: string;
  user_bindings: string;
}

export interface User extends UserCreate {
  role_sid: string;
  sid: string;
  service_sid: string;
  is_online: boolean;
  is_notifiable: boolean;
  date_created: Date;
  date_updated: Date;
  joined_channels_count: number;
  url: string;
  links: UserLinks;
}

export interface Users {
  meta: Meta;
  users: User[];
}
