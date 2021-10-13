import { IonContent } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ChatService } from '../services/chat.service';
import { ChatItem } from '../models/chat.interfaces';
import { MessageService } from '../services/message.service';
import { MessageItem } from '../models/message.interfaces';
import { Subscribe } from '../models/chat.interfaces';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit {
  @ViewChild(IonContent) private readonly messageList: IonContent;

  private showLast: boolean = true;

  readonly chat: ChatItem;

  constructor(
    private messageService: MessageService,
    private chatService: ChatService,
    private router: Router
  ) {
    this.chat = this.router.getCurrentNavigation().extras.state.chat;
    this.messageService.lastMessage.subscribe((data) => {
      if (data.chatSid === this.chat.sid && this.showLast)
        setTimeout(() => this.messageList.scrollToBottom(), 0);
    });
  }

  ngOnInit() {}

  get messages(): MessageItem[] {
    return this.messageService.getChatMessages(this.chat.sid) || [];
  }

  get pageSize(): number {
    return this.chatService.pageSize;
  }

  get draft(): string {
    return this.messageService.getDraft(this.chat.sid);
  }

  set draft(value: string) {
    this.messageService.setDraft(this.chat.sid, value);
  }

  sendMessage() {
    this.messageService.sendMessage(this.chat.sid).subscribe();
  }

  shiftUp() {
    if (this.showLast) {
      setTimeout(() => this.messageList.scrollToBottom(), 0);
    }
  }

  fetchNext(sub: Subscribe = {}) {
    this.messageService.fetchMessageItems(this.chat.sid).subscribe({
      next: sub.next,
      error: sub.error,
      complete: sub.complete,
    });
  }
}
