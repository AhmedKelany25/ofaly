import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PhoneContact } from 'src/app/contacts/models/contacts.interfaces';
import { RequestState } from 'src/app/shared/models/shared.enums';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.page.html',
  styleUrls: ['./new-group.page.scss'],
})
export class NewGroupPage implements OnInit {
  readonly members: PhoneContact[];

  name: string;

  constructor(private chatService: ChatService, private router: Router) {
    this.members = this.router.getCurrentNavigation().extras.state.contacts;
  }

  ngOnInit() {}

  get avatar(): string {
    return 'assets/icon/chat/group-avatar.svg';
  }

  get canSubmit(): boolean {
    return (
      this.chatService.createState !== RequestState.ongoing &&
      this.members &&
      this.name &&
      this.members.length > 0 &&
      this.name.length > 0
    );
  }

  createGroupeChat() {
    this.chatService
      .createGroupChat({
        name: this.name,
        avatar: this.avatar,
        members: this.members,
      })
      .subscribe((chat) => this.router.navigate([`chat/${chat.sid}`]));
  }
}
