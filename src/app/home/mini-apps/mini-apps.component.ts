import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mini-apps',
  templateUrl: './mini-apps.component.html',
  styleUrls: ['./mini-apps.component.scss'],
})
export class MiniAppsComponent implements OnInit {
  appGrid: Item[] = [];

  constructor() {
    this.appGrid = LIST.filter((m) => m);
  }

  ngOnInit() {}
}

export interface Item {
  route: string;
  title: string;
  icon: string;
}

const assets = 'assets/icon/mini-apps';
export const LIST: Item[] = [
  { route: '', title: 'Travel', icon: `${assets}/ic_travel.svg` },
  { route: '/chat', title: 'Chat', icon: `${assets}/ic_chat.svg` },
  { route: '', title: 'Pay', icon: `${assets}/ic_pay.svg` },
  { route: '', title: 'Digital', icon: `${assets}/ic_digital.svg` },
  { route: '', title: 'Sales', icon: `${assets}/ic_sales.svg` },
  { route: '/shop', title: 'Mart', icon: `${assets}/ic_mart.svg` },
  { route: '', title: 'Properties', icon: `${assets}/ic_proporties.svg` },
  { route: '', title: 'Motor', icon: `${assets}/ic_motor.svg` },
  { route: '/health', title: 'Health', icon: `${assets}/ic_health.svg` },
  { route: '', title: 'Taxi', icon: `${assets}/ic_taxi.svg` },
];
