import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, of, from } from 'rxjs';
import { catchError, map, tap, pluck, switchMap } from 'rxjs/operators';

import { Appointment, Doctor, Specialty } from '../models/api.model';
import { HealthUrlBuilder } from '../../shared/url.builder';
import { Config } from '../../shared/constants';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class HealthService {
  private ptSid$: string;
  private lang$ = 'en';
  private pastAppointments$: Appointment[] = [];
  private futureAppointments$: Appointment[] = [];
  private searchResults$: Doctor[] = [];
  private specialties$: Specialty[] = [];
  private searchDate$: Date;
  // private date$: string = '';
  constructor(
    private httpClient: HttpClient,
    private urlBuilder: HealthUrlBuilder
  ) {
    // // Get Patient Sid
    this.loadSpecialties().subscribe();
  }

  getPatientSid(): Observable<string> {
    if (this.ptSid$) {
      return of(this.ptSid$);
    }
    return from(Storage.get({ key: Config.PT_SID })).pipe(
      pluck<{ value: string }, string>('value'),
      switchMap((ptSid) =>
        ptSid
          ? of(ptSid)
          : this.httpClient
              .get<string>(this.urlBuilder.patient())
              .pipe(tap((sid) => (this.ptSid = sid)))
      ),
      tap((ptSid) => (this.ptSid$ = ptSid))
    );
  }

  get searchDate() {
    //YYYY-MM-DDDD;

    return this.searchDate$;
  }

  set searchDate(date) {
    this.searchDate$ = date;
  }

  formatSearchDate(date) {
    return date.toISOString().split('T')[0];
  }

  get searchResults() {
    return this.searchResults$;
  }

  set searchResults(results) {
    this.searchResults$ = results;
  }

  get specialties() {
    if (this.language === 'en') {
      return this.specialties$.sort((a, b) => a.en.localeCompare(b.en));
    } else {
      return this.specialties$.sort((a, b) => a.ar.localeCompare(b.ar));
    }
  }

  set specialties(specialties) {
    this.specialties$ = specialties;
  }

  get pastAppointments() {
    return this.pastAppointments$;
  }

  set pastAppointments(appointments) {
    this.pastAppointments$ = appointments;
  }

  get futureAppointments() {
    return this.futureAppointments$;
  }

  set futureAppointments(appointments) {
    this.futureAppointments$ = appointments;
  }

  get language() {
    return this.lang$;
  }

  set language(lang) {
    this.lang$ = lang;
  }

  get ptSid() {
    return this.ptSid$;
  }

  set ptSid(sid: string) {
    this.ptSid$ = sid;
    Storage.set({ key: Config.PT_SID, value: sid });
  }

  private loadSpecialties() {
    return this.httpClient
      .get<Specialty[]>(this.urlBuilder.specialty())
      .pipe(tap((res) => (this.specialties = res)));
  }

  fetchAppointments(past: boolean): Observable<Appointment[]> {
    let params = new HttpParams();
    params = params.append('past', `${past}`);
    console.log('fetchAppointments');
    console.log(past);
    console.log(params);

    return this.httpClient
      .get<Appointment[]>(this.urlBuilder.appointment(this.ptSid, null), {
        params: params,
      })
      .pipe(
        map((res) => {
          res.forEach((appointment) => {
            this.fetchDoctor(appointment.doctor_sid).subscribe(
              (doctor) => (appointment.doctor = doctor)
            );
          });
          return res;
        }),
        tap((appointments) => {
          if (past) {
            this.pastAppointments = appointments;
          } else {
            this.futureAppointments = appointments;
          }
        })
      );
  }

  searchAppointments(searchOptions) {
    const { specialty } = searchOptions;
    this.searchResults = [];
    let params = new HttpParams();
    params = params.append('lang', this.language);
    if (specialty) {
      params = params.append('specialty', specialty.en);
    }
    params = params.append('date', this.formatSearchDate(this.searchDate));

    return this.httpClient
      .get<Doctor[]>(this.urlBuilder.doctor(this.ptSid, null), {
        params: params,
      })
      .pipe(
        tap((results) => {
          this.searchResults = results;
        })
      );
  }

  formatDate(): string {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return this.searchDate$.toLocaleDateString('en', options);
  }

  makeAppointment(appointmentOptions) {
    const { doctorSid, time } = appointmentOptions;
    const body = {
      doctor_sid: doctorSid,
      time: time,
      date: this.formatSearchDate(this.searchDate),
    };
    return this.httpClient
      .post<Appointment>(this.urlBuilder.appointment(this.ptSid, null), body)
      .pipe(
        tap((appointment) => {
          this.fetchDoctor(appointment.doctor_sid).subscribe((res) => {
            appointment.doctor = res;
            this.futureAppointments.push(appointment);
          });
        }),
        catchError((err) => {
          throw err;
        })
      );
  }

  fetchDoctor(sid: string) {
    return this.httpClient.get<Doctor>(
      this.urlBuilder.doctor(this.ptSid, sid),
      {
        params: { lang: this.language },
      }
    );
  }
}
