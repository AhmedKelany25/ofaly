import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { Category } from '../../models/category.interfaces';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.scss'],
})
export class CategoryItemComponent implements OnInit {
  @Input('category-item') private category$: Category;

  constructor(private router: Router) {}

  get category() {
    return this.category$;
  }

  ngOnInit() {}

  openCategory(category: Category) {
    this.router.navigate([`shop/categories/${category.sid}`]);
  }
}
