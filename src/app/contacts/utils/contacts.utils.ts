import { PhoneContact } from './../models/contacts.interfaces';
import { Contact } from '@capacitor-community/contacts';
import {
  CountryCode,
  parsePhoneNumber,
  PhoneNumber,
} from 'libphonenumber-js/mobile';

export function split(value: string, sort: boolean = false): string[] {
  const regexForNonAlphaNum = new RegExp(/[^\p{L}\p{N}]+/gu);
  const result: string[] = value.replace(regexForNonAlphaNum, ' ').split(' ');

  return sort ? result.sort((a, b) => a.length - b.length) : result;
}

export function cleanupPhoneNumber(phoneNumber: string): string {
  return `${phoneNumber.startsWith('+') ? '+' : ''}
    ${split(phoneNumber).join('')}`;
}

export function sortContacts(contacts: PhoneContact[]): PhoneContact[] {
  return contacts.sort((a, b) =>
    a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()
      ? 1
      : a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()
      ? -1
      : 0
  );
}

export function toPhoneContacts(
  contacts: Contact[],
  defaultCountryCode: CountryCode = null
): PhoneContact[] {
  const contacts$: PhoneContact[] = [];

  contacts.forEach((contact) => {
    if (contact.phoneNumbers.length) {
      contact.phoneNumbers.forEach((number) => {
        try {
          let phoneNumber: PhoneNumber = parsePhoneNumber(
            number,
            defaultCountryCode
          );

          let phoneContact: PhoneContact = contacts$.find((contact$) =>
            contact$.phoneNumber.isEqual(phoneNumber)
          );

          if (!phoneContact) {
            contacts$.push({
              name: contact.displayName,
              phoneNumber: phoneNumber,
              avatar: '',
            });
          }
        } catch (e) {
          console.log(e);
        }
      });
      console.log('==================================================');
    }
  });

  return sortContacts(contacts$);
}

export function getContact(
  contacts: PhoneContact[],
  phoneNumber: PhoneNumber
): PhoneContact {
  return contacts.find((contact) => contact.phoneNumber.isEqual(phoneNumber));
}
