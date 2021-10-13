import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Product } from '../../models/product.interfaces';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnInit {
  @Input('product-item') private product$: Product;
  @Input('cart-item') private addToCart = false;

  constructor(private navCtrl: NavController) {}

  get product() {
    return this.product$;
  }

  ngOnInit() {}

  selectProduct() {
    if (this.addToCart) {
      this.goBack();
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}
