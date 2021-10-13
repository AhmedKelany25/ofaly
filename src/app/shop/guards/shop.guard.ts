import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { RegisterService } from '../register/register.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShopGuard implements CanActivate {
  constructor(
    private registerService: RegisterService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.registerService.shopExist().pipe(
      map((data) => {
        if (data) {
          return true;
        } else {
          this.router.navigate(['/shop/register']);
          return false;
        }
      })
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class ShopRegisterGuard implements CanActivate {
  constructor(
    private registerService: RegisterService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.registerService.shopExist().pipe(
      map((data) => {
        console.log(`ShopRegisterGuard:canActivate`);
        if (!data) {
          return true;
        } else {
          this.router.navigate(['/shop']);
          return false;
        }
      })
    );
  }
}
