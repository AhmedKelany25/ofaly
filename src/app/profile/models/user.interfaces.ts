import { PhoneNumber } from 'libphonenumber-js';

enum Gender {
  male = 'male',
  female = 'female',
}

export interface User {
  first_name: string;
  last_name: string;
  email: string;
  language: string;
  gender: Gender;
  date_of_birth: Date;
  attributes: string;
  sid: string;
  phone_number: string;
  date_created: Date;
  date_updated: Date;
  url: string;
}

export interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserData extends UserForm {
  avatar: string;
  phoneNumber: PhoneNumber;
}
