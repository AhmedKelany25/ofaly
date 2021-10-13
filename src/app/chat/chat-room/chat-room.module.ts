import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ChatRoomPageRoutingModule } from "./chat-room-routing.module";

import { ChatRoomPage } from "./chat-room.page";
import { ChatRoomHeaderComponent } from "./chat-room-header/chat-room-header.component";
import { ChatRoomMessagesComponent } from "./chat-room-messages/chat-room-messages.component";
import { MessageItemComponent } from "./message-item/message-item.component";
import { ChatRoomInputComponent } from "./chat-room-input/chat-room-input.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ChatRoomPageRoutingModule],
  declarations: [
    ChatRoomPage,
    ChatRoomHeaderComponent,
    ChatRoomMessagesComponent,
    MessageItemComponent,
    ChatRoomInputComponent,
  ],
})
export class ChatRoomPageModule {}
