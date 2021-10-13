import { Injectable } from '@angular/core';
import { PinnedApp } from './home.interfaces';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  pinnedApps: PinnedApp[];
  selectedApp: PinnedApp;

  constructor() {
    console.log('HomeService');

    this.pinnedApps = [
      { name: 'Chat', icon: 'chatbubble-ellipses-outline' },
      { name: 'Taxi', icon: 'car-sport-outline' },
      { name: 'Pay', icon: 'card-outline' },
      { name: 'Mini-Apps', icon: 'grid-outline' },
    ];

    this.selectedApp = this.pinnedApps[0];
  }
}
