import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';

import { of, Observable } from 'rxjs';
import { mapTo, catchError, switchMap } from 'rxjs/operators';

import { ChatService } from '../services/chat.service';
import { MessageService } from '../services/message.service';

@Injectable({
  providedIn: 'root',
})
export class ChatRoomGuard implements CanActivate {
  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const chatSid: string = next.paramMap.get('sid');
    const chat$ = this.chatService.getChatItem(chatSid);

    return (chat$ ? of(chat$) : this.chatService.fetchChat(chatSid)).pipe(
      switchMap((chat) => {
        this.router.getCurrentNavigation().extras.state = { chat };
        const messages = this.messageService.getChatMessages(chat.sid);

        return messages
          ? of(null)
          : this.messageService.fetchMessageItems(chat.sid);
      }),
      mapTo(true),
      catchError((_) => {
        this.router.navigate(['/chat']);
        return of(false);
      })
    );
  }
}
