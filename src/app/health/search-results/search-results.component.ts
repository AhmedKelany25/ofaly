import { Component, OnInit } from '@angular/core';
import { HealthService } from './../services/health.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit {
  constructor(private healthService: HealthService) {}

  ngOnInit() {}

  get appointments() {
    return this.healthService.searchResults;
  }
}
