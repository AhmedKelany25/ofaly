import { Component } from '@angular/core';

import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { of, from, Observable, Subject } from 'rxjs';
import { finalize, switchMap, tap } from 'rxjs/operators';

import { PopUpService } from './shared/services/pop-up.service';
import { LoadingState } from './shared/models/shared.enums';
import { Alert, Loading } from './shared/models/shared.interfaces';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private loading: HTMLIonLoadingElement;
  private loadingWillShow: boolean = false;
  private loadingWillHide: boolean = false;
  private loadingHasShown: Subject<void> = new Subject();

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private popUpService: PopUpService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.initializeApp();

    this.popUpService.loading.subscribe((data) => this.handleLoading(data));
    this.popUpService.alert.subscribe((alert) => this.showAlert(alert));
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  private showLoading(message: string = null) {
    this.loadingWillShow = true;

    from(this.loadingController.create({ message: message })).subscribe({
      next: (loading: HTMLIonLoadingElement) => {
        if (this.loadingWillHide) {
          this.loadingWillHide = false;
        } else {
          this.loading = loading;
          loading.present();
          this.loadingHasShown.next();
        }
      },
      complete: () => (this.loadingWillShow = false),
    });
  }

  private hideLoading(): Observable<boolean> {
    this.loadingWillHide = true;

    const dismiss = () =>
      from(this.loading.dismiss()).pipe(
        tap(() => {
          delete this.loading;
          this.loadingWillShow = false;
        })
      );

    return (this.loading
      ? dismiss()
      : this.loadingWillShow
      ? this.loadingHasShown.pipe(switchMap(dismiss))
      : of(true)
    ).pipe(finalize(() => (this.loadingWillHide = false)));
  }

  private handleLoading(data: Loading) {
    switch (data.action) {
      case LoadingState.show:
        this.showLoading(data.message);
        break;
      case LoadingState.hide:
        this.hideLoading().subscribe();
        break;
    }
  }

  private showAlert(data: Alert) {
    this.hideLoading()
      .pipe(switchMap(() => from(this.alertController.create(data))))
      .subscribe((alert: HTMLIonAlertElement) => alert.present());
  }
}
