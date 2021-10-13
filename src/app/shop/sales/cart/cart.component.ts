import { ProductUnitType } from '../../models/product.interfaces';
import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../services/sales.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  constructor(private cartService: SalesService) {}

  get cartItems() {
    return this.cartService.cartItems;
  }

  ngOnInit() {}

  removeItem(id: string) {
    this.cartService.removeItem(id);
  }

  getMeasurement(item) {
    switch (item) {
      case ProductUnitType.kilogram:
        return 'kg';
      case ProductUnitType.piece:
        return '';
      case ProductUnitType.liter:
        return 'l';
    }
  }

  total(item) {
    return `${item.quantity * item.price}`;
  }
}
