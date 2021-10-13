import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  BarcodeScanner,
  BarcodeScanResult,
} from '@ionic-native/barcode-scanner/ngx';

import * as JsBarcode from 'jsbarcode';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CreateProduct,
  ProductUnitType,
} from '../../models/product.interfaces';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  categoryId: string = null;
  private barcode$: string;

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private route: ActivatedRoute,
    private barcodeScanner: BarcodeScanner,
    private alertController: AlertController
  ) {}

  get unitType() {
    return ProductUnitType;
  }

  // Easy access for form fields
  get friendlyName() {
    return this.productForm.get('friendly_name');
  }

  get description() {
    return this.productForm.get('description');
  }

  get cost() {
    return this.productForm.get('cost');
  }

  get price() {
    return this.productForm.get('price');
  }

  get barcode() {
    return this.barcode$;
  }

  set barcode(barcode) {
    this.barcode$ = barcode;
    this.productForm.get('barcode').setValue(barcode);
  }

  get stock() {
    return this.productForm.get('stock');
  }

  get unit_type() {
    return this.productForm.get('unit_type');
  }

  get boxCost() {
    return this.productForm.get('box_cost');
  }

  get unitInBox() {
    return this.productForm.get('unit_in_box');
  }

  ngOnInit() {
    this.listParams();
    this.productForm = this.fb.group({
      friendly_name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(256),
        ]),
      ],
      description: [''],
      cost: [null, Validators.required],
      price: [null, Validators.required],
      barcode: [this.barcode$, Validators.required],
      box_cost: [null, Validators.required],
      unit_in_box: [null, Validators.required],
      stock: [null, Validators.required],
      categories: [[this.categoryId]],
      unit_type: [null, Validators.required],
    });
  }

  // new scan method
  scan() {
    from(this.barcodeScanner.scan())
      .pipe(map((res) => res as BarcodeScanResult))
      .subscribe((res) => {
        this.barcode = res.text;
        JsBarcode('#barcode')
          .CODE128(this.barcode, { fontSize: 18, textMargin: 0 })
          .blank(10) // Create space between the barcodes
          .render();
      });
  }

  async createProduct() {
    if (this.productForm.valid) {
      const data: CreateProduct = this.productForm.value;
      this.inventoryService.createProduct(data);
    } else {
      await this.presentError(
        this.findInvalidControlsRecursive(this.productForm)
      );
    }
  }

  private listParams() {
    this.route.queryParams.pipe(map((params) => params)).subscribe((params) => {
      const { categoryId } = params;
      this.categoryId = categoryId;
    });
  }

  async presentError(missingFields: string[] = []) {
    let message = '';
    missingFields.forEach((field) => (message += `<p>${field}\n</p>`));
    const alert = await this.alertController.create({
      header: 'Missing fields',
      subHeader: 'Please fill all fields',
      message: message,
    });

    await alert.present();
  }
  /* 
   Returns an array of invalid control/group names, or a zero-length array if 
   no invalid controls/groups where found 
 */
  public findInvalidControlsRecursive(
    formToInvestigate: FormGroup | FormArray
  ): string[] {
    let invalidControls: string[] = [];
    let recursiveFunc = (form: FormGroup | FormArray) => {
      Object.keys(form.controls).forEach((field) => {
        const control = form.get(field);
        if (control.invalid) {
          invalidControls.push(field);
        }
        if (control instanceof FormGroup) {
          recursiveFunc(control);
        } else if (control instanceof FormArray) {
          recursiveFunc(control);
        }
      });
    };
    recursiveFunc(formToInvestigate);
    return invalidControls;
  }
}
