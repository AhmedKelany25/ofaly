import { LoadingState } from './shared.enums';

export interface Meta {
  first_page_url: string;
  key: string;
  next_page_url: string;
  page: number;
  page_size: number;
  previous_page_url: string;
  url: string;
}

export interface Language {
  name: string;
  code: string;
  icon: string;
}

export interface Country {
  name: string;
  dialCode: string;
  code: string;
}

export interface Country {
  name: string;
  dialCode: string;
  code: string;
}

export interface Loading {
  action: LoadingState;
  message?: string;
}

export interface Alert {
  header: string;
  message: string;
  buttons: string[];
}
