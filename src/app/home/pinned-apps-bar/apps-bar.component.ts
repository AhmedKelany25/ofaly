import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PinnedApp } from '../home.interfaces';

@Component({
  selector: 'pinned-apps-bar',
  templateUrl: './apps-bar.component.html',
  styleUrls: ['./apps-bar.component.scss'],
})
export class PinnedAppsBarComponent implements OnInit {
  @Input('pinned-apps') pinnedApps: PinnedApp[] = [];
  @Input() selectApp: PinnedApp;
  @Output() selectAppChange: EventEmitter<PinnedApp> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  get selectedApp() {
    return this.selectApp;
  }

  set selectedApp(value: PinnedApp) {
    this.selectAppChange.emit(value);
  }

  colorOf(selected: PinnedApp) {
    return this.selectedApp == selected ? 'primary' : 'medium';
  }
}
