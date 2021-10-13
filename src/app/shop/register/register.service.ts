import { ShopInfo } from '../models/store-mg.interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, of, Subject } from 'rxjs';
import { Plugins } from '@capacitor/core';
import { Config } from 'src/app/shared/constants';
import { map, tap } from 'rxjs/operators';
import { ShopManagementUrlBuilder } from 'src/app/shared/url.builder';
import { Company } from '../models/company.interfaces';
import { Store } from '../models/store.interfaces';
import { Router } from '@angular/router';
import { v4 as uuid4 } from 'uuid';

const { Storage } = Plugins;

interface Alert {
  header: string;
  message: string;
  buttons: string[];
}

export interface ShopDetails {
  address: string;
  city: string;
  governorate: string;
}

export enum LoadingState {
  show = 'show',
  hide = 'hide',
}

interface Direction {
  page: string;
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  public goTo = new Subject<Direction>();
  public loading = new Subject<string>();
  public alert = new Subject<Alert>();

  private shopType$: string;
  private shopDetails$: ShopDetails;
  private shopInfo$: ShopInfo;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private managementUrl: ShopManagementUrlBuilder
  ) {
    // Get Store details
    from(Storage.get({ key: Config.STORE_DETAILS }))
      .pipe(map((shopDetails) => JSON.parse(shopDetails.value)))
      .subscribe((shopDetails) => {
        this.shopDetails$ = shopDetails;
      });

    // Get Store type
    from(Storage.get({ key: Config.STORE_TYPE })).subscribe(
      (shopType) => (this.shopType$ = shopType.value)
    );
    this.fetchShopInfo().subscribe();
  }

  get shopDetails() {
    return this.shopDetails$;
  }

  set shopDetails(value) {
    this.shopDetails$ = value;
    Storage.set({ key: Config.STORE_DETAILS, value: JSON.stringify(value) });
  }

  get shopType() {
    return this.shopType$;
  }

  set shopType(value) {
    this.shopType$ = value;
    Storage.set({ key: Config.STORE_TYPE, value: value });
  }

  goNext(index: number) {
    this.goTo.next({ page: 'next', title: this.getTitle(index) });
  }

  goBack(index: number) {
    this.goTo.next({ page: 'back', title: this.getTitle(index) });
  }

  showLoading() {
    this.loading.next('show');
  }

  hideLoading() {
    this.loading.next('hide');
  }

  alertNoNetwork() {
    this.alert.next({
      header: 'No Network',
      message: 'Please make sure you have internet access.',
      buttons: ['OK'],
    });
  }

  getTitle(index) {
    switch (index) {
      case 0:
        return '';
      case 1:
        return 'Your shop';
      case 2:
        return 'Shop address';
    }
  }

  createStore(): Observable<any> {
    this.showLoading();
    return this.createCompany$().pipe(
      tap((company) => {
        this.createStore$(company.sid).subscribe((store) => {
          Storage.set({
            key: Config.STORE_INFO,
            value: JSON.stringify({
              companySid: company.sid,
              storeSid: store.sid,
            }),
          });
          Storage.remove({ key: Config.STORE_TYPE });
          Storage.remove({ key: Config.STORE_DETAILS });
          this.router.navigate(['/shop']);
          this.hideLoading();
        });
      })
    );
  }

  shopExist(): Observable<boolean> {
    return from(Storage.get({ key: Config.STORE_INFO })).pipe(
      map((data) => {
        return data.value ? true : false;
      })
    );
  }

  fetchShopInfo(): Observable<ShopInfo> {
    if (this.shopInfo$) {
      return of(this.shopInfo$);
    }
    return from(Storage.get({ key: Config.STORE_INFO })).pipe(
      map((data) => {
        return data.value ? JSON.parse(data.value) : null;
      }),
      tap((data: ShopInfo) => {
        this.shopInfo$ = data;
      })
    );
  }

  private createStore$(companySid: string): Observable<Store> {
    const body = { friendly_name: `Store-${uuid4()}` };
    return this.httpClient.post<Store>(
      this.managementUrl.store(companySid),
      body
    );
  }

  private createCompany$(): Observable<Company> {
    const body = { friendly_name: `Company-${uuid4()}` };

    return this.httpClient.post<Company>(this.managementUrl.company(), body);
  }
}
