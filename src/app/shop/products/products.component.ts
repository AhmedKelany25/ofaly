import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  listItems: ListItem[];

  constructor(private router: Router) {
    this.listItems = LIST.filter((m) => m);
  }

  ngOnInit() {}

  navigateTo(menu: ListItem) {
    try {
      if (menu.route !== '') {
        this.router.navigateByUrl(`${menu.route}`);
      }
    } catch (e) {
      console.log('Error', e);
    }
  }
}

interface ListItem {
  icon: string;
  title: string;
  route: string;
}

const assetsUrl = `assets/icon/shop/`;

export const LIST: ListItem[] = [
  {
    icon: `${assetsUrl}ic_categories.svg`,
    title: `Categories`,
    route: `shop/categories`,
  },
  {
    icon: `${assetsUrl}ic_products.svg`,
    title: `All Products`,
    route: `shop/products/all`,
  },
  {
    icon: `${assetsUrl}ic_scan_product.svg`,
    title: `Inventory scanner`,
    route: ``,
  },
];
