import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { PhoneNumber } from 'libphonenumber-js';

import { RequestState } from 'src/app/shared/models/shared.enums';
import { HomeService } from './home.service';
import { PinnedApp } from './home.interfaces';
import { ContactsService } from 'src/app/contacts/services/contacts.service';
import { ChatService } from '../chat/services/chat.service';
import { PhoneContact } from '../contacts/models/contacts.interfaces';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(
    private homeService: HomeService,
    private chatService: ChatService,
    private router: Router,
    private contactsService: ContactsService
  ) {}

  get pinnedApps(): PinnedApp[] {
    return this.homeService.pinnedApps;
  }

  get selectedApp(): PinnedApp {
    return this.homeService.selectedApp;
  }

  set selectedApp(app: PinnedApp) {
    this.homeService.selectedApp = app;
  }

  get isDone(): boolean {
    return this.chatService.fetchState === RequestState.done;
  }

  goToContacts() {
    this.router.navigate(['/contacts']);
    this.chatService.contactSubmitHandler();
  }
}
