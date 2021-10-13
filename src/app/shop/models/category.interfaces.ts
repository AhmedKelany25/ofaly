import { Meta } from 'src/app/shared/models/shared.interfaces';

export interface Category {
  friendly_name: string;
  attributes: string;
  sid: string;
  url: string;
  date_created: Date;
  date_updated: Date;
  store_sid: string;
  products_count: number;
}

export interface Categories {
  categories: Category[];
  meta: Meta;
}
