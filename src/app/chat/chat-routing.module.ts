
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatPage } from './chat.page';
import { MembersGuard } from './guards/members.guard';
import { ChatRoomGuard } from './guards/chat-room.guard';

const routes: Routes = [
  {
    path: '',
    component: ChatPage,
  },
  {
    path: 'group',
    loadChildren: () =>
      import('./new-group/new-group.module').then((m) => m.NewGroupPageModule),
    canActivate: [MembersGuard],
  },
  {
    path: ':sid',
    loadChildren: () =>
      import('./chat-room/chat-room.module').then((m) => m.ChatRoomPageModule),
      canActivate: [ChatRoomGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatPageRoutingModule {}
