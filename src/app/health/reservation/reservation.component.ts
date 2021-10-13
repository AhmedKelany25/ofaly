import { Component, Input, OnInit } from '@angular/core';
import { ActiveTab } from 'src/app/shared/enums.enum';
import { Appointment } from '../models/api.model';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent implements OnInit {
  @Input('active') active$: ActiveTab;
  @Input('appointments') private appointments$: Appointment[];

  constructor() {}

  ngOnInit() {}

  get appointments() {
    return this.appointments$;
  }

  get active() {
    return this.active$;
  }
}
