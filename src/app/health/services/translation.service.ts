import { Injectable } from '@angular/core';
import { Directions, Languages } from '../../shared/enums.enum';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { Config } from '../../shared/constants';
import { from } from 'rxjs';
const { Storage } = Plugins;

export interface Language {
  name: string;
  code: string;
}
@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  appLang = Languages.English as string;
  appDir: string = Directions.LTR;
  yes: string;
  no: string;
  private language$: Language;

  constructor(private translate: TranslateService, private router: Router) {
    // Get language
    from(Storage.get({ key: Config.LANGUAGE })).subscribe((language) =>
      language.value
        ? (this.language$ = JSON.parse(language.value) as Language)
        : null
    );
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang(this.appLang);
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use(this.appLang);
  }

  get language() {
    return this.language$;
  }

  set language(value: Language) {
    this.language$ = value;
    Storage.set({ key: Config.LANGUAGE, value: JSON.stringify(value) });
  }

  get currentLang() {
    return this.translate.currentLang;
  }

  setupLanguage() {
    // Getting Texts
    this.translate.get('yes').subscribe((res) => (this.yes = res));
    this.translate.get('no').subscribe((res) => (this.no = res));

    // Getting default language
    this.translate.setDefaultLang(this.language.code);
    switch (this.language.code) {
      case Languages.Arabic || Languages.Hebrew:
        document.documentElement.dir = this.appDir = Directions.RTL;
        break;
      default:
        document.documentElement.dir = this.appDir = Directions.LTR;
        break;
    }
    this.translate.use(this.appLang);
    document.documentElement.lang = this.appLang;
  }
}
