import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ShopInventoryUrlBuilder } from '../../shared/url.builder';
import { Categories, Category } from '../models/category.interfaces';
import { Product, Products } from '../models/product.interfaces';
import { map, tap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { Config } from 'src/app/shared/constants';
import { from } from 'rxjs';
import { Router } from '@angular/router';
import { RequestState } from 'src/app/shared/models/shared.enums';
import { RegisterService } from '../register/register.service';
import { ShopInfo } from '../models/store-mg.interfaces';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private products$: Product[] = [];
  private categories$: Category[] = [];
  private storeSid$: string;
  private requestState$: {
    categories: RequestState;
    products: RequestState;
  } = { categories: RequestState.idle, products: RequestState.idle };

  constructor(
    private httpClient: HttpClient,
    private urlBuilder: ShopInventoryUrlBuilder,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alrtCtrl: AlertController,
    private registerService: RegisterService,
    private router: Router
  ) {
    this.registerService.fetchShopInfo().subscribe((res) => {
      this.storeSid = res.storeSid;
      this.fetchProducts().subscribe();
      this.fetchCategories().subscribe();
    });
  }

  get requestState() {
    return this.requestState$;
  }

  get categories() {
    return this.categories$;
  }

  set categories(categories) {
    this.categories$ = categories.sort((a, b) =>
      a.friendly_name.toLowerCase().localeCompare(b.friendly_name.toLowerCase())
    );
  }

  get products() {
    return this.products$;
  }

  set products(products) {
    this.products$ = products.sort((a, b) =>
      a.friendly_name.toLowerCase().localeCompare(b.friendly_name.toLowerCase())
    );
  }

  get storeSid() {
    return this.storeSid$;
  }

  set storeSid(sid) {
    this.storeSid$ = sid;
  }

  async createCategory(friendlyName: string) {
    // this.storeSid != null
    if (friendlyName === null) {
      await this.presentAlert(
        'Error',
        'Missing category name',
        'Category title should not be empty'
      );
      return;
    }
    const loading = await this.loadingCtrl.create({});
    await loading.present();
    const body = { friendly_name: friendlyName };
    return this.httpClient
      .post<Category>(this.urlBuilder.category(this.storeSid, null), body)
      .pipe(tap((category) => this.categories.push(category)))
      .subscribe(
        async (category: Category) => {
          await loading.dismiss();
          await this.presentToast('Category successfully created');
          this.router.navigateByUrl(`shop/categories/${category.sid}`, {
            replaceUrl: true,
          });
        },
        async (error) => {
          console.log(`Create Category ${JSON.stringify(error)}`);
          await loading.dismiss();
          await this.presentToast('Failed creating category');
        }
      );
  }

  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
    });
    await toast.present();
  }

  async presentAlert(
    header: string = null,
    subHeader: string = null,
    message: string = null
  ) {
    const alert = await this.alrtCtrl.create({
      header: `${header}`,
      subHeader: `${subHeader}`,
      message: `${message}`,
      buttons: ['OK'],
    });
    await alert.present();
  }

  getCategoryProducts(categorySid: string) {
    return this.products.filter((product) =>
      product.categories.includes(categorySid)
    );
  }

  getCategory(categorySid: string): Category {
    return this.categories.find((category) => category.sid === categorySid);
  }

  filterCategories(value: string | number = null) {
    if (!value) {
      return this.categories.sort((a, b) =>
      a.friendly_name.toLowerCase().localeCompare(b.friendly_name.toLowerCase())
    );
    } else {
      return this.categories.filter((value1) =>
        value1.friendly_name
          .toString()
          .toLowerCase()
          .startsWith(value.toString().toLowerCase())
      );
    }
  }

  filterProducts(value: string | number) {
    return this.products.filter((value1) =>
      value1.friendly_name
        .toString()
        .toLowerCase()
        .startsWith(value.toString().toLowerCase())
    );
  }

  fetchCategories() {
    this.requestState$.categories = RequestState.ongoing;
    return this.httpClient
      .get<Categories>(this.urlBuilder.category(this.storeSid, null))
      .pipe(
        map((res) => res.categories),
        tap((categories) => {
          this.categories = categories;
          this.requestState$.categories = RequestState.done;
        })
      );
  }

  fetchProducts() {
    this.requestState$.products = RequestState.ongoing;
    return this.httpClient
      .get<Products>(this.urlBuilder.product(this.storeSid, null))
      .pipe(
        map((res) => res.products),
        tap((products) => {
          this.products = products;
          this.requestState$.products = RequestState.done;
        })
      );
  }

  async createProduct(data) {
    const loading = await this.loadingCtrl.create({});
    await loading.present();
    return this.httpClient
      .post<Product>(this.urlBuilder.product(this.storeSid, null), data)
      .pipe(tap((product) => this.products.push(product)))
      .subscribe(
        async (product) => {
          await loading.dismiss();
          await this.presentToast('Product created successfully');
          this.router.navigateByUrl(
            `shop/categories/${product.categories[0]}`,
            { replaceUrl: true }
          );
        },
        async (err) => {
          await loading.dismiss();
          await this.presentToast('Failed creating product');
        }
      );
  }

  loadFromStorage() {
    from(Storage.get({ key: Config.STORE_INFO }))
      .pipe(
        map((data) => {
          return JSON.parse(data.value) as ShopInfo;
        }),
        tap((res) => {
          this.storeSid = res.storeSid;
        })
      )
      .subscribe((data) => {
        this.storeSid = data.storeSid;
      });
  }
}
