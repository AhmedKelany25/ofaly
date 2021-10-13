import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MembersGuard implements CanActivate {
  constructor(private router: Router, private location: Location) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const state$ = this.router.getCurrentNavigation().extras.state;

    if (state$ && state$.contacts && state$.contacts.length) {
      return true;
    }

    this.router.navigate([next.queryParams.redirectTo || 'chat']);
    return false;
  }
}
