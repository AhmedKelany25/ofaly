import { Component, OnInit } from '@angular/core';
import { PhoneContact } from './models/contacts.interfaces';
import { ContactsService } from './services/contacts.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  private selectedContacts$: PhoneContact[] = [];

  selectMultiple = false;

  constructor(private contactsService: ContactsService) {}

  ngOnInit() {}

  get selectedContacts(): PhoneContact[] {
    return this.selectedContacts$;
  }

  get contacts(): PhoneContact[] {
    return this.contactsService.contacts;
  }

  get filters(): string[] {
    return this.contactsService.filters;
  }

  get searchValue(): string {
    return this.contactsService.searchValue;
  }

  set searchValue(value: string) {
    this.contactsService.searchValue = value;
  }

  get showGroupItem(): boolean {
    return !this.selectMultiple && (!this.filters || this.filters.length === 0);
  }

  selectContact(contact: PhoneContact) {
    if (this.selectMultiple) {
      if (this.selectedContacts$.includes(contact)) {
        this.selectedContacts$ = this.selectedContacts$.filter(
          (contact$) => contact$ !== contact
        );
      } else {
        this.selectedContacts$.push(contact);
      }
    } else {
      this.contactsService.submitSingleContact(contact);
    }
  }

  submitContacts() {
    if (this.selectedContacts$.length) {
      this.contactsService.submitMultipleContacts(this.selectedContacts$);
    }
  }
}
