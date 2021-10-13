import { Component, Input, OnInit } from '@angular/core';
import { Appointment } from '../../models/api.model';

@Component({
  selector: 'app-future-item',
  templateUrl: './future-item.component.html',
  styleUrls: ['./future-item.component.scss'],
})
export class FutureItemComponent implements OnInit {
  @Input('appointment') appointment$: Appointment;
  constructor() {}

  ngOnInit() {}

  formatTime(value: string): string {
    const time = value.split('+');
    const time2 = time[0].split(':');
    return `${time2[0]}:${time2[1]}`;
  }

  get appointment() {
    return this.appointment$;
  }

  getPicture() {
    try {
      const attrs = JSON.parse(this.appointment.doctor.attributes);
      return attrs.avatar;
    } catch (err) {
      console.log(err);
    }
  }
}
