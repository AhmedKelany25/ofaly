import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-otp-submit',
  templateUrl: './otp-submit.component.html',
  styleUrls: ['./otp-submit.component.scss'],
})
export class OtpSubmitComponent implements OnInit {
  otpCode: string;
  otpRegex: RegExp = /^\d{5}$/g;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.requestOtpOnStart().subscribe();
  }

  ngOnInit() {}

  get phoneNumber(): string {
    return this.authService.phoneNumber.number as string;
  }

  get countdown(): string {
    return this.authService.countdown;
  }

  get ongoing(): boolean {
    return !this.authService.countdownEnded;
  }

  get invalid(): boolean {
    const match = (this.otpCode || '').match(this.otpRegex);

    return (
      !this.authService.otpSid ||
      !this.otpCode ||
      !match ||
      match[0] !== this.otpCode
    );
  }

  submit() {
    this.authService.requestToken(this.otpCode).subscribe({
      next: () => this.router.navigate([this.authService.redirectTo]),
      error: () => (this.otpCode = null),
    });
  }

  requestCode() {
    this.otpCode = null;
    this.authService.requestOtp().subscribe();
  }
}
