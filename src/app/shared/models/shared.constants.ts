import { Country, Language } from './shared.interfaces';

export const LANGUAGES: Language[] = [
  { name: 'English', code: 'en', icon: 'assets/icon/auth/usa-flag.svg' },
  { name: 'Français', code: 'fr', icon: 'assets/icon/auth/france-flag.svg' },
  { name: 'عربي', code: 'ar', icon: 'assets/icon/auth/egypt-flag.svg' },
  { name: 'Pусский', code: 'ru', icon: 'assets/icon/auth/russia-flag.svg' },
];

export const COUNTRIES: Country[] = [
  { name: 'Egypt', dialCode: '+20', code: 'eg' },
  { name: 'Russia', dialCode: '+7', code: 'ru' },
];
