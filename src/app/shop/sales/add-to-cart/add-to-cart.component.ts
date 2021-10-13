import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SalesService } from '../../services/sales.service';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.scss'],
})
export class AddToCartComponent implements OnInit {
  constructor(
    private navCtrl: NavController,
    private inventoryService: InventoryService,
    private cartService: SalesService
  ) {}

  get products() {
    return this.inventoryService.products;
  }

  ngOnInit() {}

  addToCard(product) {
    console.log(product);
    this.cartService.setPendingProduct(product);
    this.goBack();
  }

  goBack() {
    this.navCtrl.back();
  }
}
