import { AllProductsComponent } from './products/all-products/all-products.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { SalesComponent } from './sales/sales.component';
import { CategoriesComponent } from './categories/categories.component';
import { AddCategoryComponent } from './categories/add-category/add-category.component';
import { ProductsComponent } from './products/products.component';

import { ShopPage } from './shop.page';
import { AddProductComponent } from './products/add-product/add-product.component';
import { CategoryDetailsComponent } from './categories/category-details/category-details.component';
import { AddToCartComponent } from './sales/add-to-cart/add-to-cart.component';
import { CartComponent } from './sales/cart/cart.component';
import { ShopGuard, ShopRegisterGuard } from './guards/shop.guard';

const routes: Routes = [
  {
    path: '',
    component: ShopPage,
    children: [
      { path: '', component: HomeComponent, canActivate: [ShopGuard] },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [ShopRegisterGuard],
      },
      { path: 'sales', component: SalesComponent, canActivate: [ShopGuard] },
      {
        path: 'sales/cart',
        component: CartComponent,
        canActivate: [ShopGuard],
      },
      {
        path: 'sales/cart/add',
        component: AddToCartComponent,
        canActivate: [ShopGuard],
      },
      {
        path: 'categories',
        component: CategoriesComponent,
        canActivate: [ShopGuard],
      },
      {
        path: 'categories/add',
        component: AddCategoryComponent,
        canActivate: [ShopGuard],
      },
      {
        path: 'categories/:sid',
        component: CategoryDetailsComponent,
        canActivate: [ShopGuard],
      },
      {
        path: 'products',
        component: ProductsComponent,
        canActivate: [ShopGuard],
      },
      {
        path: 'products/add',
        component: AddProductComponent,
        canActivate: [ShopGuard],
      },
      {
        path: 'products/all',
        component: AllProductsComponent,
        canActivate: [ShopGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopPageRoutingModule {}
