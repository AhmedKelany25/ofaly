export enum ProductAvailability {
  any = 'Any',
  in_stock = 'In stock',
  not_available = 'Not available',
}

export enum SortBy {
  name_AZ = 'Name:A to Z',
  name_ZA = 'Name:Z to A',
  price_LH = 'Price:Low to high',
  price_HL = 'Price:high to Low',
}

export interface FilterOptions {
  categories: string[];
  availability: ProductAvailability;
  sortBy: SortBy;
}
