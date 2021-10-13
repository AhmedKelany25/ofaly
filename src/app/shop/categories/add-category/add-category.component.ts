import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
})
export class AddCategoryComponent implements OnInit {
  @ViewChild('title') categoryTitle: IonInput;

  constructor(private service: InventoryService) {}

  get title() {
    return this.categoryTitle.value
      ? (this.categoryTitle.value as string)
      : null;
  }

  ngOnInit() {}

  addCategory() {
    this.service.createCategory(this.title);
  }
}
