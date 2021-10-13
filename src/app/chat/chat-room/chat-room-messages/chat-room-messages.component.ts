import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscribe } from '../../models/chat.interfaces';
import { MessageItem } from '../../models/message.interfaces';

@Component({
  selector: 'app-chat-room-messages',
  templateUrl: './chat-room-messages.component.html',
  styleUrls: ['./chat-room-messages.component.scss'],
})
export class ChatRoomMessagesComponent implements OnInit {
  @Input() private readonly messageCount: number;
  @Input() readonly messages: MessageItem[] = [];
  @Output() readonly requestNext = new EventEmitter<Subscribe>();

  constructor() {}

  ngOnInit() {}

  get allMessagesLoaded(): boolean {
    return this.messages.length === this.messageCount;
  }

  loadMessages(event) {
    this.requestNext.emit({
      error: (error) => {
        console.log(error);
        if (error.status === 400) {
          event.target.disabled = true;
        } else {
          event.target.complete();
        }
      },
      complete: () => {
        console.log('Done');
        event.target.complete();
      },
    });
  }

  getLastMessage(index: number): MessageItem {
    return index > 0 ? this.messages[index - 1] : null;
  }
}
