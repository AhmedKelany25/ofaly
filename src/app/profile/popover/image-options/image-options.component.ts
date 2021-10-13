import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ImageOptions } from '../../models/image-options.enum';

@Component({
  selector: 'app-image-options',
  templateUrl: './image-options.component.html',
  styleUrls: ['./image-options.component.scss'],
})
export class ImageOptionsComponent implements OnInit {

  constructor(private popover: PopoverController) { }

  ngOnInit() { }

  action(action: ImageOptions) {
    this.popover.dismiss(action);
  }

  get options() {
    return ImageOptions;
  }
}
