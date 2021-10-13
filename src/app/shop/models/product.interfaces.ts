import { Meta } from 'src/app/shared/models/shared.interfaces';
import { Category } from './category.interfaces';

export interface Product extends Category {
  cost: number;
  price: number;
  barcode: string;
  url: string;
  categories: string[];
  stock: number;
  unit_type: ProductUnitType;
}

export enum ProductUnitType {
  piece = 'piece',
  kilogram = 'kilogram',
  liter = 'liter',
}

export interface Products {
  products: Product[];
  meta: Meta;
}

export interface CreateProduct {
  friendly_name: string;
  cost: number; // Unit cost
  price: number; // Unit price
  barcode: string;
  categories: string[];
  unit_type: ProductUnitType;
  stock: number;
}
