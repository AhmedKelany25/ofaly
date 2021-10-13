import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.scss'],
})
export class CategoryDetailsComponent implements OnInit {
  searchVisible: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private inventory: InventoryService
  ) {}

  get category() {
    return this.inventory.getCategory(`${this.route.snapshot.url[1]}`);
  }

  get products() {
    return this.inventory.getCategoryProducts(this.category.sid);
  }

  ngOnInit() {}

  addProduct() {
    this.router.navigate(['shop/products/add'], {
      queryParams: { categoryId: `${this.route.snapshot.url[1]}` },
    });
  }
}
