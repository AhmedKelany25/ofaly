import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterOptions } from '../../models/filter.enum';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-products-filter',
  templateUrl: './products-filter.component.html',
  styleUrls: ['./products-filter.component.scss'],
})
export class ProductsFilterComponent implements OnInit {
  @Output('filter-options')
  filterOptions: EventEmitter<FilterOptions> = new EventEmitter();
  filterGroup: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.filterGroup = this.fb.group({
      categories: [],
      name: [],
      sortBy: [],
    });
  }
}
