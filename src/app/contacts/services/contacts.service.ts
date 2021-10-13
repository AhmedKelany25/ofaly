import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
  catchError,
  finalize,
  map,
  pluck,
  switchMap,
  tap,
} from 'rxjs/operators';
import { from, Observable, of, Subject } from 'rxjs';

import { RequestState } from 'src/app/shared/models/shared.enums';
import { PhoneContact, DUMMY_CONTACTS } from '../models/contacts.interfaces';
import {
  getContact,
  sortContacts,
  split,
  toPhoneContacts,
} from '../utils/contacts.utils';

import { CountryCode, parsePhoneNumber } from 'libphonenumber-js/mobile';

import { Contact, PermissionStatus } from '@capacitor-community/contacts';
import { Plugins } from '@capacitor/core';
import { AuthService } from 'src/app/auth/services/auth.service';
const { Contacts } = Plugins;

interface ContactsResponse {
  contacts: Contact[];
}

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private contacts$: PhoneContact[] = [];
  private searchValue$: string = '';
  private filters$: string[];
  private filteredContacts: PhoneContact[];
  private pastSearchValue: string = '';
  private loadingState: RequestState = RequestState.idle;
  private awaitDone: Subject<PhoneContact[]> = new Subject();

  private onSubmitActions: {
    single: (contact: PhoneContact) => Observable<any>;
    multiple: (contacts: PhoneContact[]) => Observable<any>;
  } = {
    single: (contact) => {
      console.log(
        `Selected Contact:\n>>> ${contact.name}: ${contact.phoneNumber.number}`
      );
      return from(this.router.navigate(['/home']));
    },
    multiple: (contacts) => {
      console.log('Selected Contacts:');
      contacts.forEach((contact) =>
        console.log(`>>> ${contact.name}: ${contact.phoneNumber.number}`)
      );
      return from(this.router.navigate(['/home']));
    },
  };

  constructor(private authService: AuthService, private router: Router) {
    this.hasPermission()
      .pipe(
        switchMap((granted) => {
          if (granted) {
            this.loadingState = RequestState.ongoing;
            return this.fetchContacts$();
          }
        })
      )
      .subscribe((contacts) => this.loadingDone(contacts));
  }

  get searchValue(): string {
    return this.searchValue$;
  }

  set searchValue(value: string) {
    this.pastSearchValue = this.searchValue$;
    this.searchValue$ = value;
    this.filters$ = split(value, true);
  }

  get filters(): string[] {
    return this.filters$;
  }

  get contacts(): PhoneContact[] {
    if (!this.filters$ || !this.filters$.length) {
      this.filteredContacts = this.contacts$;
      return this.contacts$;
    }

    const newSearch: string = this.searchValue.trim().toLocaleLowerCase();
    const oldSearch: string = this.pastSearchValue.trim().toLocaleLowerCase();

    if (!newSearch.startsWith(oldSearch)) {
      this.filteredContacts = this.contacts$;
    }

    this.filteredContacts = this.filteredContacts.filter(
      (contact) =>
        this.nameFilter(contact.name) ||
        this.numberFilter(contact.phoneNumber.number as string)
    );

    return this.filteredContacts;
  }

  private loadingDone(contacts: PhoneContact[]) {
    this.loadingState = RequestState.done;
    this.awaitDone.next(contacts);
    this.awaitDone.complete();
  }

  private nameFilter(value: string): boolean {
    const parts: string[] = split(value);
    const partsMap = new Map();
    let filters: string[] = [...this.filters$];

    for (let part of parts) {
      for (let filter of filters) {
        if (part.toLocaleLowerCase().startsWith(filter.toLocaleLowerCase())) {
          partsMap.set(part, filter);
        }
      }

      if (partsMap.has(part)) {
        let index: number = filters.findIndex((f) => f === partsMap.get(part));
        if (index > -1) filters.splice(index, 1);

        if (!filters.length) break;
      }
    }

    return filters.length === 0;
  }

  private numberFilter(value: string): boolean {
    for (let filter of this.filters$) {
      if (!value.includes(filter)) {
        return false;
      }
    }

    return true;
  }

  onSubmitSingleContact(action: (contact: PhoneContact) => Observable<any>) {
    this.onSubmitActions.single = action;
  }

  onSubmitMultipleContacts(
    action: (contact: PhoneContact[]) => Observable<any>
  ) {
    this.onSubmitActions.multiple = action;
  }

  submitSingleContact(contact: PhoneContact) {
    this.onSubmitActions
      .single(contact)
      .pipe(finalize(() => setTimeout(() => (this.searchValue = ''), 500)))
      .subscribe();
  }

  submitMultipleContacts(contacts: PhoneContact[]) {
    this.onSubmitActions
      .multiple(contacts)
      .pipe(finalize(() => setTimeout(() => (this.searchValue = ''), 500)))
      .subscribe();
  }

  hasPermission(): Observable<boolean> {
    return from(Contacts.getPermissions()).pipe(
      pluck<PermissionStatus, boolean>('granted'),
      catchError((_) => of(true))
    );
  }

  private fetchContacts$(): Observable<PhoneContact[]> {
    return from(Contacts.getContacts()).pipe(
      pluck<ContactsResponse, Contact[]>('contacts'),
      map((contacts: Contact[]) =>
        toPhoneContacts(
          contacts,
          this.authService.country.code.toLocaleUpperCase() as CountryCode
        )
      ),
      catchError((_) => of(sortContacts(DUMMY_CONTACTS))),
      tap((contacts: PhoneContact[]) => {
        this.contacts$ = contacts;
        this.filteredContacts = contacts;
      })
    );
  }

  fetchContacts(): Observable<PhoneContact[]> {
    if (this.loadingState === RequestState.done) {
      return of(this.contacts$);
    } else {
      return this.awaitDone;
    }
  }

  fetchContact(phoneNumber: string): Observable<PhoneContact> {
    const phoneNumber$ = parsePhoneNumber(phoneNumber);

    if (this.loadingState === RequestState.done) {
      return of(getContact(this.contacts$, phoneNumber$));
    } else {
      return this.awaitDone.pipe(
        map((contacts) => getContact(contacts, phoneNumber$))
      );
    }
  }
}
