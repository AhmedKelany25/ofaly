import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RequestState } from 'src/app/shared/models/shared.enums';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  constructor(private chatService: ChatService, private router: Router) {}

  ngOnInit() {}

  get isDone(): boolean {
    return this.chatService.fetchState === RequestState.done;
  }

  goToContacts() {
    this.router.navigate(['/contacts']);
    this.chatService.contactSubmitHandler();
  }
}
