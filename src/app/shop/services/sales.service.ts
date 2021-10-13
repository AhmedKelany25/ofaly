import { Injectable } from '@angular/core';
import { Product } from '../models/product.interfaces';
import { Subject } from 'rxjs';

export interface Item {
  id: string;
  price: number;
  title: string;
  measurement: string;
}

export interface CartItem extends Item {
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  pendingProduct: Subject<Product> = new Subject<Product>();
  private cartItems$: CartItem[] = [];

  constructor() {}

  get cartItems() {
    return this.cartItems$;
  }

  set cartItems(items) {
    this.cartItems$ = items;
  }

  get items() {
    const items = [];
    this.cartItems.forEach((item) => {
      items.push({ product_sid: item.id, quantity: item.quantity });
    });
    return items;
  }

  get total() {
    let total = 0;
    if (this.cartItems.length > 0) {
      this.cartItems.forEach((item) => {
        total = total + item.quantity * item.price;
      });
    }
    return total;
  }

  setPendingProduct(value: Product) {
    this.pendingProduct.next(value);
  }

  addItem(newSale: Product, quantity: number) {
    // const item = this.getItem(newSale.sid);
    const cartItem: CartItem = {
      id: newSale.sid,
      price: newSale.price,
      title: newSale.friendly_name,
      measurement: newSale.unit_type,
      quantity: quantity,
    };
    this.cartItems$.push(cartItem);
  }

  removeItem(id: string) {
    this.cartItems$ = this.cartItems$.filter((item) => item.id !== id);
  }

  getItem(id: string) {
    return this.cartItems$.find((item) => item.id === id);
  }
}
