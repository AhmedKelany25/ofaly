import { HealthPageRoutingModule } from './health-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NgMedicalPage } from './health.page';
import { TranslateModule } from '@ngx-translate/core';
import { HomeComponent } from './home/home.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { ReservationComponent } from './reservation/reservation.component';
import { AddAppointmentComponent } from './add-appointment/add-appointment.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { SearchItemComponent } from './search-item/search-item.component';
import { PastItemComponent } from './reservation/past-item/past-item.component';
import { FutureItemComponent } from './reservation/future-item/future-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    HealthPageRoutingModule,
  ],
  declarations: [
    NgMedicalPage,
    HomeComponent,
    AppointmentsComponent,
    ReservationComponent,
    AddAppointmentComponent,
    SearchResultsComponent,
    SearchItemComponent,
    PastItemComponent,
    FutureItemComponent,
  ],
})
export class HealthPageModule {}
