import { PhoneNumber, parsePhoneNumber } from 'libphonenumber-js/mobile';

export interface PhoneContact {
  name: string;
  phoneNumber: PhoneNumber;
  avatar: string;
}

export const DUMMY_CONTACTS: PhoneContact[] = [
  {
    name: 'Mohammad Ragaey',
    phoneNumber: parsePhoneNumber('01020899838', 'EG'),
    avatar: '',
  },
  {
    name: 'Mohammad Zakout',
    phoneNumber: parsePhoneNumber('9515397210', 'RU'),
    avatar: '',
  },
  {
    name: 'MoDi',
    phoneNumber: parsePhoneNumber('+79508435532', 'RU'),
    avatar: '',
  },
  { name: 'Soha', phoneNumber: parsePhoneNumber('+201200712118'), avatar: '' },
  {
    name: 'محمد شفيق',
    phoneNumber: parsePhoneNumber('+201021518517'),
    avatar: '',
  },
  {
    name: 'Catalin',
    phoneNumber: parsePhoneNumber('+201064510638'),
    avatar: '',
  },
  {
    name: 'Ahmad Radwan',
    phoneNumber: parsePhoneNumber('+201115699863'),
    avatar: '',
  },
  {
    name: 'Ahmad Habiba',
    phoneNumber: parsePhoneNumber('+201114447720'),
    avatar: '',
  },
  {
    name: 'Mohammad Ibrahim',
    phoneNumber: parsePhoneNumber('+201111861122'),
    avatar: '',
  },
  {
    name: 'Mohammad Wael',
    phoneNumber: parsePhoneNumber('+201011464788'),
    avatar: '',
  },
  {
    name: 'Moataz Mohamed',
    phoneNumber: parsePhoneNumber('+79638527410'),
    avatar: '',
  },
  {
    name: 'Mohamed Moawya',
    phoneNumber: parsePhoneNumber('+201234567890'),
    avatar: '',
  },
  {
    name: "3bd-el3'far",
    phoneNumber: parsePhoneNumber('+200987654321'),
    avatar: '',
  },
  {
    name: 'رمضان مبروك ابو العلمين حموده',
    phoneNumber: parsePhoneNumber('+201020304050'),
    avatar: '',
  },
];
