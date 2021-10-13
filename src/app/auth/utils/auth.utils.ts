import { PhoneNumber } from 'libphonenumber-js/mobile';
import jwt_decode from 'jwt-decode';

import {
  AccessToken,
  RawAccessToken,
  RefreshToken,
  RawRefreshToken,
  TokenType,
  ChatToken,
  RawChatToken,
} from '../models/auth.interfaces';

export function toTimer(timeDelta: number): string {
  if (timeDelta > 0) {
    const minutes: number = Math.floor(timeDelta / 60);
    const seconds: number = timeDelta - minutes * 60;

    return `${minutes.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
    })}:${seconds.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
    })}`;
  } else {
    return '00:00';
  }
}

export function formatPhoneNumber(phoneNumber: PhoneNumber): string {
  return phoneNumber.formatInternational().split(' ').slice(1).join(' ');
}

export function decodeAccessToken(token: string): AccessToken {
  const accessToken: RawAccessToken = jwt_decode(token);
  const iat = new Date(accessToken.iat * 1000);
  const exp = new Date(accessToken.exp * 1000);
  const use = TokenType[accessToken.use];

  return { ...accessToken, iat, exp, use };
}

export function decodeRefreshToken(token: string): RefreshToken {
  const refreshToken: RawRefreshToken = jwt_decode(token);
  const iat = new Date(refreshToken.iat * 1000);
  const use = TokenType[refreshToken.use];

  return { ...refreshToken, iat, use };
}

export function decodeChatToken(token: string): ChatToken {
  const chatToken: RawChatToken = jwt_decode(token);
  const iat = new Date(chatToken.iat * 1000);
  const exp = new Date(chatToken.exp * 1000);
  return { ...chatToken, iat, exp };
}
