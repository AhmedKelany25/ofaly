import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-products-header',
  templateUrl: './products-header.component.html',
  styleUrls: ['./products-header.component.scss'],
})
export class ProductsHeaderComponent implements OnInit {
  @Output('search') searchEnabled: EventEmitter<boolean> = new EventEmitter();
  private search$: boolean = false;
  private title$: string = 'Products';

  constructor() {}

  get search() {
    return this.search$;
  }

  set search(value) {
    this.search$ = value;
    value ? (this.title$ = 'Filter products') : (this.title$ = 'Products');
    this.searchEnabled.emit(value);
  }

  get title() {
    return this.title$;
  }

  set title(title) {
    this.title$ = title;
  }

  ngOnInit() {}
}
