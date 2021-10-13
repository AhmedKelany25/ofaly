import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LANGUAGES } from 'src/app/shared/models/shared.constants';
import { Language } from 'src/app/shared/models/shared.interfaces';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  get languages(): Language[] {
    return LANGUAGES;
  }

  selectLanguage(language: Language) {
    this.authService.language = language;
    this.router.navigate(['/auth/country']);
  }
}
