import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: `app-home`,
  templateUrl: `./home.component.html`,
  styleUrls: [`./home.component.scss`],
})
export class HomeComponent implements OnInit {
  listItems: ListItem[] = [];

  constructor(private navCtrl: NavController, private router: Router) {
    this.listItems = LIST.filter((m) => m);
  }

  ngOnInit() {}
  goTo(item: ListItem) {
    try {
      if (item.route !== ``) {
        this.router.navigateByUrl(`${item.route}`);
      }
    } catch (e) {
      console.log(`Error `, e);
    }
  }

  async navigateBack() {
    this.navCtrl.navigateBack('/home');
  }
  
}

export class ListItem {
  icon: string;
  title: string;
  route: string;
}

const assetsUrl = `assets/icon/shop/`;
export const LIST: ListItem[] = [
  {
    icon: `${assetsUrl}ic_new_sale.svg`,
    title: `New sale`,
    route: `shop/sales`,
  },
  {
    icon: `${assetsUrl}ic_products.svg`,
    title: `Products`,
    route: `shop/products`,
  },
  {
    icon: `${assetsUrl}ic_categories.svg`,
    title: `Categories`,
    route: `shop/categories`,
  },
  { icon: `${assetsUrl}ic_scan_product.svg`, title: `Scan product`, route: `` },
  { icon: `${assetsUrl}ic_reports.svg`, title: `Reports`, route: `` },
  { icon: `${assetsUrl}ic_receipt.svg`, title: `Receipts`, route: `` },
  { icon: `${assetsUrl}ic_settings.svg`, title: `Settings`, route: `` },
];
