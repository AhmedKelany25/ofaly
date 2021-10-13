import { BaseModel } from './api.model';

export interface Store extends BaseModel {
  company_sid: string;
  links: StoreLinks;
}

export interface StoreLinks {
  operators: string;
}
