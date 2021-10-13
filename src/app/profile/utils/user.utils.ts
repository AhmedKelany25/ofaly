import { parsePhoneNumber } from 'libphonenumber-js';

import { UserData } from '../models/user.interfaces';

export function userDataToJSON(userData: UserData): string {
  const data = {
    ...userData,
    phoneNumber: userData.phoneNumber
      ? (userData.phoneNumber.number as string)
      : null,
  };

  return JSON.stringify(data);
}

export function userDataFromJSON(json: string): UserData {
  const data = JSON.parse(json);

  try {
    data.phoneNumber = parsePhoneNumber(data.phoneNumber);
  } catch {
    data.phoneNumber = null;
  }

  return data as UserData;
}
