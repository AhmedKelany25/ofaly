import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactsPageRoutingModule } from './contacts-routing.module';
import { HighlightPipe } from './utils/highlight.pipe';
import { ContactsPage } from './contacts.page';
import { ContactHeaderComponent } from './contact-header/contact-header.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactItemComponent } from './contact-item/contact-item.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ContactsPageRoutingModule],
  declarations: [
    ContactsPage,
    ContactHeaderComponent,
    ContactListComponent,
    ContactItemComponent,
    HighlightPipe,
  ],
})
export class ContactsPageModule {}
