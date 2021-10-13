import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PhoneContact } from '../models/contacts.interfaces';

@Component({
  selector: 'app-contact-header',
  templateUrl: './contact-header.component.html',
  styleUrls: ['./contact-header.component.scss'],
})
export class ContactHeaderComponent implements OnInit {
  @Input('selected-contacts') selectedContacts: PhoneContact[] = [];
  @Output('search-value')
  searchValueChange: EventEmitter<string> = new EventEmitter();
  @Output('submit-selection')
  submitSelection: EventEmitter<undefined> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
