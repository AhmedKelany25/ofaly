import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from '../register.service';

@Component({
  selector: 'app-shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.scss'],
})
export class ShopDetailsComponent implements OnInit {
  shopDetailsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService
  ) {}

  ngOnInit() {
    this.shopDetailsForm = this.fb.group({
      address: [null, Validators.required],
      city: [null, Validators.required],
      governorate: [null, Validators.required],
    });
  }

  submit() {
    this.registerService.shopDetails = this.shopDetailsForm.value;
    this.registerService.createStore().subscribe((res) => {});
  }
}
