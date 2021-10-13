import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthPageRoutingModule } from './auth-routing.module';
import { AuthPage } from './auth.page';
import { AuthHeaderComponent } from './auth-header/auth-header.component';
import { CountrySelectorComponent } from './country-selector/country-selector.component';
import { OtpSubmitComponent } from './otp-submit/otp-submit.component';
import { RegisterPhoneNumberComponent } from './register-phone-number/register-phone-number.component';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AuthPageRoutingModule,
  ],
  declarations: [
    AuthPage,
    AuthHeaderComponent,
    LanguageSelectorComponent,
    CountrySelectorComponent,
    RegisterPhoneNumberComponent,
    OtpSubmitComponent,
  ],
})
export class AuthPageModule {}
