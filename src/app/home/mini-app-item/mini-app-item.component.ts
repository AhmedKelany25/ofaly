import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../mini-apps/mini-apps.component';

@Component({
  selector: 'mini-app-item',
  templateUrl: './mini-app-item.component.html',
  styleUrls: ['./mini-app-item.component.scss'],
})
export class MiniAppItemComponent implements OnInit {
  @Input('mini-app') private miniApp$: Item;
  constructor() {}

  ngOnInit() {}

  get app() {
    return this.miniApp$;
  }
}
