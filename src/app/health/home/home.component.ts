import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  menuItems: any[];
  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private translate: TranslateService,
    private router: Router
  ) {
    this.menuItems = HOME_MENU_ITEMS.filter((m) => m);
    this.platform.backButton.subscribeWithPriority(-1, () => {
      this.router.navigate(['/home']);
    });
  }

  ngOnInit() {}
  goTo(menu) {
    try {
      this.router.navigate([`health/${menu.route}`]);
    } catch (e) {}
  }
  async navigateBack() {
    this.navCtrl.navigateBack('/home');
  }
}

const ICON_BASE_URL = 'assets/icon/medical/services';
export const HOME_MENU_ITEMS: any[] = [
  {
    route: '',
    icon: `${ICON_BASE_URL}/ic_virtual_clinic.svg`,
    title: 'medical.services.virtual_clinic',
  },
  {
    route: '',
    icon: `${ICON_BASE_URL}/ic_support.svg`,
    title: 'medical.services.support',
  },
  {
    route: '',
    icon: `${ICON_BASE_URL}/ic_medical_file.svg`,
    title: 'medical.services.med_file',
  },
  {
    route: 'appointments',
    icon: `${ICON_BASE_URL}/ic_appointments.svg`,
    title: 'medical.services.appointments',
  },
  {
    route: '',
    icon: `${ICON_BASE_URL}/ic_ask_doctor.svg`,
    title: 'medical.services.ask_doctor',
  },
  {
    route: '',
    icon: `${ICON_BASE_URL}/ic_invoices_payments.svg`,
    title: 'medical.services.invoices_payments',
  },
  {
    route: '',
    icon: `${ICON_BASE_URL}/ic_tests_price.svg`,
    title: 'medical.services.test_price',
  },
  {
    route: '',
    icon: `${ICON_BASE_URL}/ic_healthcare_info.svg`,
    title: 'medical.services.healthcare_info',
  },
  {
    route: '',
    icon: `${ICON_BASE_URL}/ic_doctors.svg`,
    title: 'medical.services.doctors',
  },
  {
    route: '',
    icon: `${ICON_BASE_URL}/ic_location.svg`,
    title: 'medical.services.location',
  },
  {
    route: '',
    icon: `${ICON_BASE_URL}/ic_medical_dictionary.svg`,
    title: 'medical.services.medical_dictionary',
  },
];
