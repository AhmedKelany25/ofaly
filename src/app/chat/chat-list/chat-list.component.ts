import { Component, OnInit } from '@angular/core';

import { switchMap } from 'rxjs/operators';

import { RequestState } from 'src/app/shared/models/shared.enums';
import { ChatItem } from '../models/chat.interfaces';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
  constructor(private chatService: ChatService) {}

  ngOnInit() {
    if (this.isIdle) {
      this.chatService
        .createInitChats()
        .pipe(switchMap(() => this.chatService.fetchChatItems()))
        .subscribe();
    }
  }

  get chats(): ChatItem[] {
    return this.chatService.chatItems;
  }

  get isIdle(): boolean {
    return this.chatService.fetchState === RequestState.idle;
  }

  get isDone(): boolean {
    return this.chatService.fetchState === RequestState.done;
  }

  get pageSize(): number {
    return this.chatService.pageSize;
  }

  cached(chatSid: string): boolean {
    return this.chatService.isCached(chatSid);
  }

  loadChats(event) {
    this.chatService.fetchChatItems().subscribe({
      next: (chats: ChatItem[]) => {
        if (!chats || chats.length < this.pageSize) {
          event.target.disabled = true;
        }
      },
      error: (error) => {
        console.log(error);
        if (error.status === 400) {
          event.target.disabled = true;
        } else {
          event.target.complete();
        }
      },
      complete: () => {
        event.target.complete();
      },
    });
  }
}
