import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActiveTab } from 'src/app/shared/enums.enum';
import { HealthService } from '../services/health.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent implements OnInit {
  title: string = 'medical.tabs.appointments';
  loaded: boolean = false;
  active: ActiveTab = ActiveTab.future;

  constructor(private router: Router, private healthService: HealthService) {}

  ngOnInit() {
    if (this.appointments.length) {
      this.loaded = true;
    } else {
      this.healthService
        .fetchAppointments(this.active === ActiveTab.past)
        .subscribe({
          next: (apo) => {
            console.log(apo);
          },
          complete: () => (this.loaded = true),
        });
    }
  }

  get appointments() {
    if (this.active === ActiveTab.past) {
      return this.healthService.pastAppointments;
    } else {
      return this.healthService.futureAppointments;
    }
  }

  showActive(active: ActiveTab): string {
    if (this.active === active) {
      return 'primary';
    } else {
      return 'white';
    }
  }

  get activeTab() {
    return ActiveTab;
  }

  open(active: ActiveTab) {
    console.log(`${active}`);

    this.active = active;
  }

  addAppointment() {
    this.router.navigate(['health/appointments/add']);
  }
}
