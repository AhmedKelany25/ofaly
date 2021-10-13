import { AddAppointmentComponent } from './add-appointment/add-appointment.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NgMedicalPage } from './health.page';
import { AppointmentsComponent } from './appointments/appointments.component';
import { SearchResultsComponent } from './search-results/search-results.component';

const routes: Routes = [
  {
    path: '',
    component: NgMedicalPage,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'appointments',
        component: AppointmentsComponent,
      },
      {
        path: 'appointments/add',
        component: AddAppointmentComponent,
      },
      {
        path: 'appointments/search',
        component: SearchResultsComponent,
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HealthPageRoutingModule {}
