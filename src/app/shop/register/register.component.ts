import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController } from '@ionic/angular';

import { LoadingState, RegisterService } from './register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, AfterViewInit {
  @ViewChild('slides') slides: IonSlides;
  pageIndex = 0;
  loading: HTMLIonLoadingElement;
  title: string = '';

  constructor(
    private registerService: RegisterService,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.registerService.goTo.subscribe(async (action) => {
      const { page, title } = action;
      this.title = title;
      switch (page) {
        case 'next':
          await this.applySlide(async () => {
            await this.slides.slideNext();
          });
          this.pageIndex++;
          break;
        case 'back':
          await this.applySlide(async () => {
            await this.slides.slidePrev();
          });
          this.pageIndex--;
          break;
      }
    });

    this.registerService.loading.subscribe(async (state) => {
      switch (state) {
        case LoadingState.show:
          await this.showLoading();
          break;
        case LoadingState.hide:
          await this.hideLoading();
          break;
      }
    });
  }

  ngAfterViewInit(): void {
    this.slides.lockSwipes(true);
  }

  async applySlide(slideAction: Function) {
    await this.slides.lockSwipes(false);
    await slideAction();
    await this.slides.lockSwipes(true);
  }

  async back() {
    this.registerService.goBack(this.pageIndex - 1);
  }

  async showLoading() {
    if (!this.loading) {
      this.loading = await this.loadingController.create();
      await this.loading.present();
    }
  }

  async hideLoading() {
    if (this.loading) {
      await this.loading.dismiss();
      delete this.loading;
    }
  }

  getSlideStyle() {
    if (!this.pageIndex) {
      return 'height: 100%;';
    } else {
      return '';
    }
  }
}
