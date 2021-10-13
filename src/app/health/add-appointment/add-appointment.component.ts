import { Component, OnInit } from '@angular/core';
import { Languages } from 'src/app/shared/enums.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HealthService } from '../services/health.service';

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrls: ['./add-appointment.component.scss'],
})
export class AddAppointmentComponent implements OnInit {
  searchForm: FormGroup;
  lang: string = 'en';
  constructor(
    private formBuilder: FormBuilder,
    private healthService: HealthService,
    private router: Router
  ) {
    this.searchForm = this.formBuilder.group({
      specialty: [''],
      date: [null, Validators.required],
    });
    this.lang = localStorage.getItem('lang') || Languages.English;
  }

  ngOnInit() {}

  setSearchDate(event) {
    const date = new Date(event.detail.value);
    this.healthService.searchDate = date;
  }

  get specialties() {
    if (this.lang === 'en') {
      return this.healthService.specialties.sort((a, b) =>
        a.en.localeCompare(b.en)
      );
    } else {
      return this.healthService.specialties.sort((a, b) =>
        a.ar.localeCompare(b.ar)
      );
    }
  }

  capitalize(word) {
    return word[0].toUpperCase() + word.substr(1);
  }

  searchAppointment() {
    const searchOptions = {
      specialty: this.specialty.value,
    };
    this.healthService.searchAppointments(searchOptions).subscribe((res) => {});
    this.router.navigate(['health/appointments/search']);
  }

  get formDate() {
    return this.searchForm.get('date');
  }

  get specialty() {
    return this.searchForm.get('specialty');
  }

  validDate() {
    const today = new Date();
    const searchDate = new Date(this.formDate.value);
    unifyTime(today);
    unifyTime(searchDate);
    return today <= searchDate ? true : false;
  }
}

function unifyTime(date: Date) {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0, 0);
}
