import { Observable } from 'rxjs';

import { PhoneNumber } from 'libphonenumber-js';

import { Country, Language } from 'src/app/shared/models/shared.interfaces';

export enum UserScope {
  create = 'user:create',
  read = 'user:read',
  write = 'user:write',
}

export interface OtpRequest {
  phone_number: string;
}

export interface OtpResponse {
  sid: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
}

export enum TokenType {
  access = 'access',
  refresh = 'refresh',
}

interface BaseToken {
  jti: string;
  iss: string;
  aud: string[];
}

interface MainToken extends BaseToken {
  sub: string;
  use: TokenType;
}

interface AccessTokenBase extends MainToken {
  scope: UserScope[];
  rti: string;
  use: TokenType.access;
}

interface RefreshTokenBase extends MainToken {
  use: TokenType.refresh;
}

interface ChatTokenBase extends BaseToken {
  grants: object;
}

export interface RawAccessToken extends AccessTokenBase {
  iat: number;
  exp: number;
}

export interface AccessToken extends AccessTokenBase {
  iat: Date;
  exp: Date;
}

export interface RawRefreshToken extends RefreshTokenBase {
  iat: number;
}

export interface RefreshToken extends RefreshTokenBase {
  iat: Date;
}

export interface RawChatToken extends ChatTokenBase {
  iat: number;
  exp: number;
}

export interface ChatToken extends ChatTokenBase {
  iat: Date;
  exp: Date;
}

type AuthToken<T> = {
  token: string;
  data: T;
};

export interface AuthTokens {
  access: AuthToken<AccessToken>;
  refresh: AuthToken<RefreshToken>;
  chat: AuthToken<ChatToken>;
}

export interface PersistedAuthTokens {
  access: string;
  refresh: string;
  chat: string;
}

export interface AuthSteps {
  redirectTo: string;
  language?: Language;
  country?: Country;
  phoneNumber?: PhoneNumber;
  otpSid?: string;
}

export interface Countdown {
  readonly ended: boolean;
  readonly value: string;
  resume: () => Observable<number>;
  stop: () => void;
  start: () => void;
  onEnd: () => Observable<void>;
}
