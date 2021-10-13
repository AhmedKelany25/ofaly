import { PhoneContact } from '../models/contacts.interfaces';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.component.html',
  styleUrls: ['./contact-item.component.scss'],
})
export class ContactItemComponent implements OnInit {
  @Input('contact') private readonly contact$: PhoneContact;
  @Input('filters') private readonly filters$: string[];
  @Input('check-mark') readonly withCheckMark: boolean = false;
  @Input('selected') readonly isChecked: boolean = false;
  @Output() private select: EventEmitter<PhoneContact> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  get name(): string {
    return this.contact$.name;
  }

  get phoneNumber(): string {
    return this.contact$.phoneNumber.number as string;
  }

  get filters(): string[] {
    return this.filters$;
  }

  get avatar(): string {
    return this.contact$ && this.contact$.avatar
      ? this.contact$.avatar
      : 'assets/icon/chat/single-avatar.svg';
  }

  selectContact() {
    this.select.emit(this.contact$);
  }
}
