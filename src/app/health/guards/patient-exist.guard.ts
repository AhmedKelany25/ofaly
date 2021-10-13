import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HealthService } from '../services/health.service';

@Injectable({
  providedIn: 'root',
})
export class PatientExistGuard implements CanActivate {
  constructor(private service: HealthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.service
      .getPatientSid()
      .pipe(map((sid) => (sid ? true : false)));
  }
}
