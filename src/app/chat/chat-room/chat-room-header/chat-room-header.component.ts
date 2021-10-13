import { Component, Input, OnInit } from '@angular/core';

import { ChatItem } from '../../models/chat.interfaces';

@Component({
  selector: 'app-chat-room-header',
  templateUrl: './chat-room-header.component.html',
  styleUrls: ['./chat-room-header.component.scss'],
})
export class ChatRoomHeaderComponent implements OnInit {
  @Input() chatData: ChatItem;
  constructor() {}

  ngOnInit() {}

  get avatar(): string {
    return this.chatData ? this.chatData.avatar : null;
  }

  get title(): string {
    return this.chatData ? this.chatData.title : 'Untitled';
  }
}
