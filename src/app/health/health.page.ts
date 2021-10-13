import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { Menu } from './health.models';
import { TranslationService } from './services/translation.service';

@Component({
  selector: 'app-health',
  templateUrl: './health.page.html',
  styleUrls: ['./health.page.scss'],
})
export class NgMedicalPage implements OnInit {
  @ViewChild('myTabs') tabs: IonTabs;
  menuTabs: Menu[];
  activeTab: string;
  language: string = this.translate.currentLang;

  constructor(private translate: TranslationService) {
    this.menuTabs = MENU;
    this.activeTab = this.menuTabs[2].tab;
  }

  ngOnInit() {}

  getTabIcon(menu: Menu): string {
    return menu.tab === this.activeTab ? menu.activeIcon : menu.inactiveIcon;
  }

  getSelectedTab(event): void {
    this.activeTab = event.tab;
  }
}
const BASE_URL_TABS_ICONS = 'assets/icon/medical/tabs';
export const MENU: Menu[] = [
  {
    tab: 'education',
    activeIcon: `${BASE_URL_TABS_ICONS}/ic_edu_red.svg`,
    inactiveIcon: `${BASE_URL_TABS_ICONS}/ic_edu_grey.svg`,
    title: 'Education',
  },
  {
    tab: 'appointments',
    activeIcon: `${BASE_URL_TABS_ICONS}/ic_appointments_red.svg`,
    inactiveIcon: `${BASE_URL_TABS_ICONS}/ic_appointments_grey.svg`,
    title: 'medical.tabs.appointments',
  },
  {
    tab: 'home',
    activeIcon: `${BASE_URL_TABS_ICONS}/ic_home_red.svg`,
    inactiveIcon: `${BASE_URL_TABS_ICONS}/ic_home_grey.svg`,
    title: 'medical.tabs.home',
  },
  {
    tab: 'doctor',
    activeIcon: `${BASE_URL_TABS_ICONS}/ic_ask_doctor_red.svg`,
    inactiveIcon: `${BASE_URL_TABS_ICONS}/ic_ask_doctor_grey.svg`,
    title: 'medical.tabs.ask_doctor',
  },
  {
    tab: 'file',
    activeIcon: `${BASE_URL_TABS_ICONS}/ic_med_file_red.svg`,
    inactiveIcon: `${BASE_URL_TABS_ICONS}/ic_med_file_grey.svg`,
    title: 'medical.tabs.med_file',
  },
];
