import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Plugins } from '@capacitor/core';

import { from, Observable, of, Subject, EMPTY } from 'rxjs';
import {
  catchError,
  filter,
  finalize,
  map,
  pluck,
  switchMap,
  tap,
} from 'rxjs/operators';

import { UserUrlBuilder } from 'src/app/shared/url.builder';
import { AuthService } from 'src/app/auth/services/auth.service';
import { RequestState } from 'src/app/shared/models/shared.enums';
import { MemberService } from 'src/app/chat/services/member.service';
import { User, UserData, UserForm } from '../models/user.interfaces';
import { userDataFromJSON, userDataToJSON } from '../utils/user.utils';

const { Storage } = Plugins;

const USER_DATA = 'userData';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userData$: UserData = {
    firstName: null,
    lastName: null,
    email: null,
    avatar: null,
    phoneNumber: null,
  };

  private readonly requestState: {
    storage: RequestState;
    server: RequestState;
  } = {
      storage: RequestState.idle,
      server: RequestState.idle,
    };

  private readonly awaitDone: Subject<UserData> = new Subject();

  constructor(
    private authService: AuthService,
    private memberService: MemberService,
    private httpClient: HttpClient,
    private userUrl: UserUrlBuilder,
    private router: Router
  ) {
    this.fetchUserData$().subscribe();
  }

  get userData(): Observable<UserData> {
    return this.requestState.storage <= RequestState.ongoing
      ? this.awaitDone
      : of(this.userData$);
  }

  set userForm(value: UserForm) {
    let changed: boolean = false;

    for (let key in value) {
      if (this.userData$[key] !== value[key]) {
        this.userData$[key] = value[key];
        changed = true;
      }
    }

    if (changed) this.persistUser();
  }

  get avatar(): string {
    return this.userData$.avatar;
  }

  set avatar(value: string) {
    this.userData$.avatar = value;
    this.persistUser();
  }

  private persistUser() {
    Storage.set({ key: USER_DATA, value: userDataToJSON(this.userData$) });
  }

  private loadingDone(userData: UserData) {
    this.requestState.storage = RequestState.done;
    this.awaitDone.next(userData);
    this.awaitDone.complete();
  }

  private fetchUserData$(): Observable<UserData> {
    this.requestState.storage = RequestState.ongoing;

    return from(Storage.get({ key: USER_DATA })).pipe(
      pluck('value'),
      filter((userData) => (userData ? true : false)),
      map((userData) => userDataFromJSON(userData)),
      map((userData) => {
        if (!userData.phoneNumber) {
          userData.phoneNumber = this.authService.phoneNumber;
        }

        return userData;
      }),
      tap((userData) => {
        this.userData$ = userData;

        this.persistUser();
        this.loadingDone(this.userData$);
      })
    );
  }

  createUser(): Observable<User> {
    const body = {
      first_name: this.userData$.firstName,
      last_name: this.userData$.lastName,
      email: this.userData$.email,
    };

    if (!this.userData$.email) {
      delete body.email;
    }

    if (this.userData$.avatar) {
      body['attributes'] = JSON.stringify(this.userData$.avatar);
    }

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authService.jwt}`,
    });

    return this.httpClient
      .post<User>(this.userUrl.user(), body, {
        headers: headers,
      })
      .pipe(
        tap(() => {
          this.authService
            .refreshAccessToken()
            .pipe(
              switchMap(() => this.memberService.createUser()),
              catchError(() => EMPTY),
              finalize(() => this.router.navigate(['/home']))
            )
            .subscribe();
        })
      );
  }
}
