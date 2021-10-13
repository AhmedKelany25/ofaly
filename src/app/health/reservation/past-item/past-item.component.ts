import { Component, Input, OnInit } from '@angular/core';
import { AppointmentState } from 'src/app/shared/enums.enum';
import { Appointment, Doctor } from '../../models/api.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-past-item',
  templateUrl: './past-item.component.html',
  styleUrls: ['./past-item.component.scss'],
})
export class PastItemComponent implements OnInit {
  @Input('appointment') appointment$: Appointment;

  constructor(private translate: TranslateService) {}

  ngOnInit() {}

  get appointment() {
    return this.appointment$;
  }

  status(appointmentState: AppointmentState) {
    let state = '';
    this.translate
      .get(`medical.state.${appointmentState}`)
      .subscribe((res) => (state = res));
    return state;
  }

  formatTime(value: string): string {
    const time = value.split('+');
    const time2 = time[0].split(':');
    return `${time2[0]}:${time2[1]}`;
  }

  getPicture(doctor: Doctor) {
    try {
      const attrs = JSON.parse(doctor.attributes);
      console.log(attrs);
      return attrs.url;
    } catch (err) {
      console.log(err);
    }
  }

  statusImage(appointmentState: AppointmentState) {
    switch (appointmentState) {
      case AppointmentState.canceled:
        return 'assets/icon/medical/status/ic_canceled.svg';
      case AppointmentState.done:
        return 'assets/icon/medical/status/done.svg';
      case AppointmentState.standing:
        return 'assets/icon/medical/status/ic_standing.svg';
    }
  }
}
