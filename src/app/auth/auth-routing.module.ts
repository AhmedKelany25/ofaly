import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CountrySelectorComponent } from './country-selector/country-selector.component';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import { OtpSubmitComponent } from './otp-submit/otp-submit.component';
import { RegisterPhoneNumberComponent } from './register-phone-number/register-phone-number.component';
import { RedirectGuard } from './guards/redirect.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [RedirectGuard],
  },
  {
    path: 'language',
    component: LanguageSelectorComponent,
    canActivate: [RedirectGuard],
  },
  {
    path: 'country',
    component: CountrySelectorComponent,
    canActivate: [RedirectGuard],
  },
  {
    path: 'phone-number',
    component: RegisterPhoneNumberComponent,
    canActivate: [RedirectGuard],
  },
  {
    path: 'otp',
    component: OtpSubmitComponent,
    canActivate: [RedirectGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthPageRoutingModule {}
