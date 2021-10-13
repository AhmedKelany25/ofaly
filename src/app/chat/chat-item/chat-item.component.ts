import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { when } from 'src/app/shared/utils/shared.utils';
import { ChatItem } from '../models/chat.interfaces';

@Component({
  selector: 'app-chat-item',
  templateUrl: './chat-item.component.html',
  styleUrls: ['./chat-item.component.scss'],
})
export class ChatItemComponent implements OnInit {
  @Input('chat-data') private chatData: ChatItem;
  @Input() private cached: boolean = false;

  private loading$: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {}

  get avatar(): string {
    return this.chatData ? this.chatData.avatar : null;
  }

  get title(): string {
    return this.chatData ? this.chatData.title : 'NoName';
  }

  get message(): string {
    return this.chatData ? this.chatData.message : null;
  }

  get unreadCount() {
    return this.chatData && this.chatData.unreadCount
      ? this.chatData.unreadCount < 100
        ? this.chatData.unreadCount || null
        : '99+'
      : null;
  }

  get time(): Date {
    return this.chatData ? this.chatData.time : null;
  }

  get when(): string {
    return this.chatData ? when(this.chatData.time) : null;
  }

  get loading(): boolean {
    return !this.cached && this.loading$;
  }

  goToChatRoom() {
    this.loading$ = true;

    this.router
      .navigate([`/chat/${this.chatData.sid}`])
      .then(() => (this.loading$ = false));
  }
}
