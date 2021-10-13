import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PopoverController } from '@ionic/angular';

import { map } from 'rxjs/operators';
import { ImageOptionsComponent } from '../popover/image-options/image-options.component';

import { UserService } from '../services/user.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  userForm: FormGroup;

  constructor(
    private userService: UserService,
    private popoverController: PopoverController
  ) {
    this.createForm();

    this.userService.userData.subscribe((userData) =>
      this.userForm.setValue({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
      })
    );

    this.userForm.valueChanges
      .pipe(
        map((values) => {
          for (let key in values) {
            values[key] = (values[key] || '').trim();
          }
          return values;
        })
      )
      .subscribe((userForm) => (this.userService.userForm = userForm));
  }

  ngOnInit() { }

  get avatar(): string {
    return this.userService.avatar || 'assets/icon/chat/single-avatar.svg';
  }

  createForm() {
    this.userForm = new FormGroup({
      firstName: new FormControl(null, [
        Validators.minLength(1),
        Validators.maxLength(120),
        Validators.pattern(/[\p{L}\p{N}]+/u),
      ]),
      lastName: new FormControl(null, [
        Validators.minLength(1),
        Validators.maxLength(120),
        Validators.pattern(/[\p{L}\p{N}]+/u),
      ]),
      email: new FormControl(null, [
        Validators.minLength(5),
        Validators.maxLength(320),
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ]),
    });
  }

  singUp() {
    this.userService.createUser().subscribe();
  }
  
  valid(byValueOnly: boolean = false): boolean {
    const firstName = this.userForm.get('firstName').value;
    const lastName = this.userForm.get('lastName').value;
    const email = this.userForm.get('email').value;

    if (byValueOnly) {
      return firstName || lastName || email ? true : false
    }

    if (this.userForm.valid) {
      return !firstName && lastName
        ? false
        : firstName || email ? true : false
    }

    return false;
  }



  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: ImageOptionsComponent,
      event: ev,
      translucent: true
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();
    console.log(`Popover dismiss with data ${data}`);
  }

  skip() {
    this.singUp();
  }

}
