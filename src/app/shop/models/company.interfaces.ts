import { BaseModel } from './api.model';

export interface Company extends BaseModel {
  default_company_owner_role_sid: string;
  default_store_manager_role_sid: string;
  default_company_user_role_sid: string;
  default_store_cashier_role_sid: string;
  links: CompanyLinks;
}

export interface CompanyLinks {
  users: string;
  roles: string;
  stores: string;
}
