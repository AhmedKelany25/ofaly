import { IonInput } from '@ionic/angular';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { InventoryService } from '../../services/inventory.service';
import { Category } from '../../models/category.interfaces';
import { FilterOptions } from '../../models/filter.enum';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss'],
})
export class AllProductsComponent implements OnInit, OnDestroy {
  @ViewChild('search') searchInput: IonInput;
  categoryId: string;
  searchVisible = false;
  category: Category;
  title = 'All products';
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inventoryService: InventoryService
  ) {}

  get categoey() {
    if (this.categoryId) {
      const cat = this.inventoryService.getCategory(this.categoryId);
      this.title = cat.friendly_name;
      return cat;
    }
  }

  get products() {
    return this.inventoryService.products;
  }

  ngOnInit() {
    this.listParams();
    if (this.inventoryService.products.length) {
    } else {
      this.inventoryService.fetchProducts().subscribe((res) => {
        console.log(res);
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilter(filterOptions: FilterOptions) {}

  openCategory() {
    this.router.navigate(['shop/categories']);
  }

  addProduct() {
    this.router.navigate(['shop/products/add']);
  }

  toggleSearch(enabled: boolean) {
    console.log(enabled);
    this.searchVisible = enabled;
  }

  private listParams() {
    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$),
        map((params) => params)
      )
      .subscribe((params) => {
        const { categoryId } = params;
        this.categoryId = categoryId;

        if (!params) {
          console.log(`No params`);
        }
      });
  }
}
