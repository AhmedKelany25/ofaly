import { RegisterService } from '../register.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-shop-type',
  templateUrl: './shop-type.component.html',
  styleUrls: ['./shop-type.component.scss'],
})
export class ShopTypeComponent implements OnInit {
  typeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService
  ) {}

  get shopType() {
    return this.typeForm.get('shopType').value;
  }

  set shopType(ev: CustomEvent) {
    this.typeForm.get('shopType').patchValue(ev.detail.value);
  }

  ngOnInit() {
    this.typeForm = this.fb.group({
      shopType: [null, Validators.required],
    });
  }

  submit() {
    console.log(this.typeForm.get('shopType').value);
    this.registerService.shopType = this.typeForm.get('shopType').value;
    this.registerService.goNext(2);
  }
}
