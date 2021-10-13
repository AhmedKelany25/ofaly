import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  AsYouType,
  parsePhoneNumber,
  CountryCode,
} from 'libphonenumber-js/mobile';

import { Country } from 'src/app/shared/models/shared.interfaces';
import { AuthService } from '../services/auth.service';
import { formatPhoneNumber } from '../utils/auth.utils';

@Component({
  selector: 'app-register-phone-number',
  templateUrl: './register-phone-number.component.html',
  styleUrls: ['./register-phone-number.component.scss'],
})
export class RegisterPhoneNumberComponent implements OnInit {
  private phoneNumber$: string;

  constructor(private authService: AuthService, private router: Router) {
    if (authService.phoneNumber) {
      this.phoneNumber$ = formatPhoneNumber(authService.phoneNumber);
    }
  }

  ngOnInit() {}

  get dialCode(): string {
    const country: Country = this.authService.country;

    if (country) return country.dialCode;
  }

  get code(): CountryCode {
    const country: Country = this.authService.country;

    if (country) return country.code.toLocaleUpperCase() as CountryCode;
  }

  get phoneNumber(): string {
    return this.phoneNumber$;
  }

  set phoneNumber(value: string) {
    const asYouType = new AsYouType(this.code);
    asYouType.input(value);

    this.phoneNumber$ = asYouType.getNumber()
      ? formatPhoneNumber(asYouType.getNumber())
      : '';
  }

  get valid(): boolean {
    try {
      return parsePhoneNumber(this.phoneNumber$, this.code).isValid();
    } catch {
      return false;
    }
  }

  requestOtp() {
    this.authService.phoneNumber = parsePhoneNumber(
      this.phoneNumber,
      this.code
    );

    this.authService
      .requestOtp(false)
      .subscribe({ complete: () => this.router.navigate(['auth/otp']) });
  }
}
