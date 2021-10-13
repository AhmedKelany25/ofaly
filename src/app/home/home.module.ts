import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { PinnedAppsBarComponent } from './pinned-apps-bar/apps-bar.component';
import { MiniAppsComponent } from './mini-apps/mini-apps.component';
import { MiniAppItemComponent } from './mini-app-item/mini-app-item.component';
import { ChatPageModule } from '../chat/chat.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ChatPageModule,
  ],
  declarations: [
    HomePage,
    PinnedAppsBarComponent,
    MiniAppsComponent,
    MiniAppItemComponent,
  ],
})
export class HomePageModule {}
