import { ChatItemComponent } from './chat-item/chat-item.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import { ChatPage } from './chat.page';
import { ChatListComponent } from './chat-list/chat-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageRoutingModule,
    RouterModule,
  ],
  declarations: [ChatPage, ChatItemComponent, ChatListComponent],
  exports: [ChatListComponent],
})
export class ChatPageModule {}
