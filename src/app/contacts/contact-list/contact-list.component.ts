import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { PhoneContact } from '../models/contacts.interfaces';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit {
  @Input('contacts') readonly contacts: PhoneContact[] = [];
  @Input('filters') private filters$: string[] = [];
  @Input('select-multiple') readonly withCheckMark: boolean = false;
  @Input('selected-contacts') readonly selectedContacts: PhoneContact[] = [];
  @Output('contact-selected')
  private contactSelected: EventEmitter<PhoneContact> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  get filters(): string[] {
    return this.filters$;
  }

  selectContact(event: PhoneContact) {
    this.contactSelected.emit(event);
  }
}
