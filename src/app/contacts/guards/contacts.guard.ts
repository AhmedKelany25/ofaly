import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ContactsService } from '../services/contacts.service';

@Injectable({
  providedIn: 'root',
})
export class ContactsGuard implements CanActivate {
  constructor(private contactsService: ContactsService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.contactsService.hasPermission();
  }
}
