import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { IonInput } from '@ionic/angular';
import { InventoryService } from '../services/inventory.service';
import { RequestState } from '../../shared/models/shared.enums';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  title: any = 'Categories';
  searchVisible = false;
  filterValue: string = null;
  @ViewChild('filterInput') filterInput: IonInput;

  constructor(
    private router: Router,
    private inventoryService: InventoryService
  ) {}

  get categories() {
    return this.inventoryService.filterCategories(this.filterValue);
  }

  get isCategoryDone() {
    console.log(this.inventoryService.requestState.categories);
    return this.inventoryService.requestState.categories === RequestState.done;
  }

  ngOnInit() {}

  addCategory() {
    this.router.navigateByUrl('shop/categories/add');
  }
}
