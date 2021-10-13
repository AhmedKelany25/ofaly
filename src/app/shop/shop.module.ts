import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopPageRoutingModule } from './shop-routing.module';

import { ShopPage } from './shop.page';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { SalesComponent } from './sales/sales.component';
import { BarcodeScannerComponent } from './sales/barcode-scanner/barcode-scanner.component';
import { CategoriesComponent } from './categories/categories.component';
import { AddCategoryComponent } from './categories/add-category/add-category.component';
import { ProductsComponent } from './products/products.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { AllProductsComponent } from './products/all-products/all-products.component';
import { ProductItemComponent } from './products/product-item/product-item.component';
import { CategoryDetailsComponent } from './categories/category-details/category-details.component';
import { AddToCartComponent } from './sales/add-to-cart/add-to-cart.component';
import { CartComponent } from './sales/cart/cart.component';
import { IntroComponent } from './register/intro/intro.component';
import { ShopTypeComponent } from './register/shop-type/shop-type.component';
import { ShopDetailsComponent } from './register/shop-details/shop-details.component';
import { ProductsHeaderComponent } from './products/products-header/products-header.component';
import { ProductsFilterComponent } from './products/products-filter/products-filter.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { StaffComponent } from './staff/staff.component';
import { ScannedResultComponent } from './sales/scanned-result/scanned-result.component';
import { CategoryItemComponent } from './categories/category-item/category-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ShopPageRoutingModule,
  ],
  declarations: [
    ShopPage,
    RegisterComponent,
    HomeComponent,
    SalesComponent,
    BarcodeScannerComponent,
    CategoriesComponent,
    AddCategoryComponent,
    CategoryDetailsComponent,
    CategoryItemComponent,
    ProductsComponent,
    AddProductComponent,
    AllProductsComponent,
    ProductItemComponent,
    AddToCartComponent,
    CartComponent,
    IntroComponent,
    ShopTypeComponent,
    ShopDetailsComponent,
    ProductsHeaderComponent,
    ProductsFilterComponent,
    ProductListComponent,
    StaffComponent,
    ScannedResultComponent,
  ],
})
export class ShopPageModule {}
