import { HealthService } from './../services/health.service';
import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DoctorAppointments } from '../models/api.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.scss'],
})
export class SearchItemComponent implements OnInit {
  @Input('appointment') private appointment$: DoctorAppointments;
  yes: string = 'yes';
  no: string = 'no';
  title: string;
  appointmentChoice = 'You chose';

  constructor(
    private loadingController: LoadingController,
    private alertController: AlertController,
    private translate: TranslateService,
    private healthService: HealthService,
    private router: Router
  ) {
    translate.get('dialog.yes').subscribe((res) => (this.yes = res));
    translate.get('dialog.no').subscribe((res) => (this.no = res));
    translate
      .get('dialog.confirm_title')
      .subscribe((res) => (this.title = res));
    translate
      .get('dialog.appointmentChoice')
      .subscribe((res) => (this.appointmentChoice = res));
  }

  ngOnInit() {}

  get appointment() {
    return this.appointment$;
  }

  getPicture() {
    try {
      const attrs = JSON.parse(this.appointment.attributes);
      return attrs.avatar;
    } catch (err) {
      return 'https://drgsearch.com/wp-content/uploads/2020/01/no-photo.png';
    }
  }

  formatTime(value: string): string {
    const time = value.split('+');
    const time2 = time[0].split(':');
    return `${time2[0]}:${time2[1]}`;
  }

  formatDate(): string {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return this.healthService.searchDate.toLocaleDateString(
      this.translate.currentLang,
      options
    );
  }

  async selectAppointmentSlot(time: any) {
    const alert = await this.alertController.create({
      header: this.title,
      buttons: [
        {
          text: this.no,
          role: 'cancel',
          handler: () => {},
        },
        {
          text: this.yes,
          role: 'ok',
          handler: async () => {
            const options = {
              doctorSid: this.appointment.sid,
              time: time,
            };
            const loading = await this.loadingController.create({});
            await loading.present();
            this.healthService.makeAppointment(options).subscribe(
              async (res) => {
                await loading.dismiss();
                this.router.navigate(['health/appointments']);
              },
              async (error) => {
                await loading.dismiss();
              }
            );
          },
        },
      ],
    });

    await alert.present();
  }
}
