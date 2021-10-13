import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RedirectGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const navigateTo: string = this.authService.navigateTo;
    const steps: string[] = [
      '/auth/language',
      '/auth/country',
      '/auth/phone-number',
      '/auth/otp',
    ];
    const current: number = steps.findIndex((step) => step === state.url);
    const latest: number = steps.findIndex((step) => step === navigateTo);

    if (state.url === '/auth' || current > latest) {
      this.router.navigate([navigateTo]);
      return false;
    } else {
      return true;
    }
  }
}
