import { Component, Input, OnInit } from '@angular/core';
import { when } from 'src/app/shared/utils/shared.utils';
import { MessageItem, MessageStatus } from '../../models/message.interfaces';
import { canMerge } from '../../utils/message.utils';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss'],
})
export class MessageItemComponent implements OnInit {
  @Input('message') private message: MessageItem;
  @Input('last-message') private lastMessage: MessageItem;

  constructor() {}

  ngOnInit() {}

  get avatar() {
    return this.message && this.message.avatar
      ? this.message.avatar
      : 'assets/icon/chat/single-avatar.svg';
  }

  get sender(): string {
    return this.message ? this.message.sender.name : null;
  }

  get body(): string {
    return this.message ? this.message.body : null;
  }

  get time(): Date {
    return this.message ? this.message.time : null;
  }

  get when(): string {
    return this.message ? when(new Date(this.message.time)) : null;
  }

  get isPending(): boolean {
    return this.message ? this.message.status === MessageStatus.pending : false;
  }

  get follower(): boolean {
    return this.message && this.lastMessage
      ? canMerge(this.message, this.lastMessage)
      : false;
  }

  get dateTitle() {
    const d1 = this.message.time;

    if (this.lastMessage) {
      const d2 = this.lastMessage.time;
      return d1.getDate() !== d2.getDate() ? d1 : null;
    } else {
      return d1;
    }
  }
}
