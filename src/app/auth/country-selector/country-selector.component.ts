import { Component, OnInit } from '@angular/core';

import { COUNTRIES } from 'src/app/shared/models/shared.constants';
import { Country } from 'src/app/shared/models/shared.interfaces';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-country-selector',
  templateUrl: './country-selector.component.html',
  styleUrls: ['./country-selector.component.scss'],
})
export class CountrySelectorComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  get countries() {
    return COUNTRIES;
  }

  get country(): Country {
    const country = this.authService.country;

    return country
      ? COUNTRIES.find((country$) => country$.code === country.code)
      : null;
  }

  set country(value: Country) {
    this.authService.country = value;
  }
}
