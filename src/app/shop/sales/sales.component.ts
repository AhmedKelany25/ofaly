import { SalesService } from '../services/sales.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { Product } from '../models/product.interfaces';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent implements OnInit {
  @ViewChild('slides') slides: IonSlides;
  unit = 1; // if kg || l -> 1000
  total: any = '00';
  totalFraction: any = '00';
  pendingProduct: Product;
  private amount$ = '0';

  constructor(private router: Router, private salesService: SalesService) {}

  get totalCheck() {
    return this.salesService.total;
  }

  get amount(): number {
    return parseInt(this.amount$, 10) / this.unit;
  }

  set amount(value: number) {
    if (this.pendingProduct) {
      this.amount$ = this.amount$.concat(`${value}`);
    }
  }

  get cancelIcon() {
    if (this.amount === 0) {
      return 'close-outline';
    } else {
      return 'backspace-outline';
    }
  }

  get cartTotal() {
    return Math.floor(this.salesService.total);
  }

  ngOnInit() {
    this.total = this.salesService.total;
    this.salesService.pendingProduct.subscribe((product: Product) => {
      if (product !== null) {
        this.pendingProduct = product;
        this.slides.lockSwipes(false);
        this.slides.slideNext();
        this.slides.lockSwipes(true);
      }
    });
  }

  ngAfterViewInit(): void {
    this.slides.lockSwipes(true);
  }

  calculateTotal() {
    return this.pendingProduct.price * this.amount;
  }

  presentProductResult() {}

  openCart() {
    this.router.navigate(['shop/sales/cart']);
  }

  selectProduct() {
    this.router.navigate(['shop/sales/cart/add']);
  }

  cancelPending() {
    this.pendingProduct = null;
    this.amount$ = '0';
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

  delete() {
    if (this.amount$ === '0') {
      this.cancelPending();
    } else {
      this.deleteLastDigit();
    }
  }

  deleteLastDigit() {
    if (this.amount$.length >= 1) {
      this.amount$ = this.amount$.substr(0, this.amount$.length - 1);
    }
  }

  addToCart() {
    if (this.amount$ === '0') {
      return;
    }
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
    this.salesService.addItem(this.pendingProduct, this.amount);
    this.pendingProduct = null;
    this.amount$ = '0';
  }
}
