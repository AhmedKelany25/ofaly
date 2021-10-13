import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { from, Subject, Observable, of, EMPTY } from 'rxjs';
import {
  map,
  tap,
  pluck,
  filter,
  switchMap,
  mergeMap,
  finalize,
} from 'rxjs/operators';

import { Plugins } from '@capacitor/core';
import { PhoneNumber, parsePhoneNumber } from 'libphonenumber-js/mobile';

import { UserUrlBuilder, ChatUrlBuilder } from 'src/app/shared/url.builder';
import { Country, Language } from 'src/app/shared/models/shared.interfaces';
import { LoadingState, NetworkState } from 'src/app/shared/models/shared.enums';
import { NetworkService } from 'src/app/shared/services/network.service';
import { PopUpService } from 'src/app/shared/services/pop-up.service';
import {
  AuthSteps,
  AuthTokens,
  Countdown as CountdownType,
  OtpRequest,
  OtpResponse,
  PersistedAuthTokens,
  TokenResponse,
  UserScope,
} from '../models/auth.interfaces';
import {
  decodeAccessToken,
  decodeChatToken,
  decodeRefreshToken,
} from '../utils/auth.utils';
import { Countdown } from '../models/countdown.class';

const { Storage } = Plugins;

const AUTH_TOKENS = 'authTokens';
const AUTH_STEPS = 'authSteps';

enum TokenToRefresh {
  access = 'access',
  chat = 'chat',
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private steps: AuthSteps = { redirectTo: '/home' };
  private tokens: AuthTokens = {
    access: null,
    refresh: null,
    chat: null,
  };
  private readonly countdown$: CountdownType = new Countdown(180);
  private readonly refreshTrigger: Subject<TokenToRefresh> = new Subject();

  private skipRefresh: boolean = false;
  private phoneNumberChanged: boolean = false;

  constructor(
    private popUp: PopUpService,
    private httpClient: HttpClient,
    private userUrl: UserUrlBuilder,
    private chatUrl: ChatUrlBuilder,
    private networkService: NetworkService
  ) {
    this.refreshTrigger
      .pipe(mergeMap((token) => this.handleTokenRefresh(token)))
      .subscribe();
    this.fetchAuthSteps().subscribe();
    this.fetchAuthTokens().subscribe({
      complete: () => {
        this.setNextRefreshTrigger(TokenToRefresh.access);
        this.setNextRefreshTrigger(TokenToRefresh.chat);
      },
    });

    this.countdown$.onEnd().subscribe(() => this.removeOtpSid());
  }

  private set chatToken(value: string) {
    if (value) {
      this.setChatToken(value);
      this.persistAuthTokens();
    }
  }

  private set accessToken(value: string) {
    if (value) {
      this.setAccessToken(value);
      this.persistAuthTokens();
    }
  }

  private set refreshToken(value: string) {
    if (value) {
      this.setRefreshToken(value);
      this.persistAuthTokens();
    }
  }

  private get refreshHeader(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.tokens.refresh.token}`,
    });
  }

  get accessHeader(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.tokens.access.token}`,
    });
  }

  get language() {
    return this.steps.language;
  }

  set language(value: Language) {
    this.steps.language = value;
    this.persistAuthSteps();
  }

  get country() {
    return this.steps.country;
  }

  set country(value: Country) {
    this.steps.country = value;
    this.persistAuthSteps();
  }

  get phoneNumber(): PhoneNumber {
    return this.steps.phoneNumber;
  }

  set phoneNumber(value: PhoneNumber) {
    if (this.steps.phoneNumber !== value) {
      this.steps.phoneNumber = value;
      this.phoneNumberChanged = true;
      this.persistAuthSteps();
    } else {
      this.phoneNumberChanged = false;
    }
  }

  get otpSid(): string {
    return this.steps.otpSid;
  }

  set otpSid(value: string) {
    this.steps.otpSid = value;
    this.persistAuthSteps();
  }

  get countdown(): string {
    return this.countdown$.value;
  }

  get countdownEnded(): boolean {
    return this.countdown$.ended;
  }

  get jwt(): string {
    return this.tokens.access ? this.tokens.access.token : null;
  }

  get chatJwt(): string {
    return this.tokens.chat ? this.tokens.chat.token : null;
  }

  get redirectTo(): string {
    return this.steps.redirectTo;
  }

  set redirectTo(value: string) {
    this.steps.redirectTo = value;
    this.persistAuthSteps();
  }

  get navigateTo(): string {
    if (!this.steps.language) return '/auth/language';
    else if (!this.steps.country) return '/auth/country';
    else if (!this.steps.phoneNumber) return '/auth/phone-number';
    else return '/auth/otp';
  }

  private handleTokenRefresh(
    tokenType: TokenToRefresh
  ): Observable<TokenResponse> {
    switch (tokenType) {
      case TokenToRefresh.access:
        if (this.skipRefresh) {
          this.skipRefresh = false;
          return EMPTY;
        } else {
          return this.fetchMainTokens(
            this.userUrl.refresh(),
            {},
            { headers: this.refreshHeader }
          );
        }

      case TokenToRefresh.chat:
        return this.fetchChatToken();
    }
  }

  private persistAuthTokens() {
    Storage.set({
      key: AUTH_TOKENS,
      value: JSON.stringify({
        access: this.tokens.access ? this.tokens.access.token : null,
        refresh: this.tokens.refresh ? this.tokens.refresh.token : null,
        chat: this.tokens.chat ? this.tokens.chat.token : null,
      }),
    });
  }

  private persistAuthSteps() {
    let extra = {};

    if (this.steps.phoneNumber) {
      extra = { phoneNumber: this.steps.phoneNumber.number };
    }

    Storage.set({
      key: AUTH_STEPS,
      value: JSON.stringify({ ...this.steps, ...extra }),
    });
  }

  private removeOtpSid() {
    delete this.steps.otpSid;
    this.persistAuthSteps();
    this.countdown$.stop();
  }

  private setAccessToken(value: string) {
    try {
      this.tokens.access = {
        token: value,
        data: decodeAccessToken(value),
      };
    } catch (error) {
      console.log('setAccessToken');
      console.log(error);
    }
  }

  private setRefreshToken(value: string) {
    try {
      this.tokens.refresh = {
        token: value,
        data: decodeRefreshToken(value),
      };
    } catch (error) {
      console.log('setRefreshToken');
      console.log(error);
    }
  }

  private setChatToken(value: string) {
    try {
      this.tokens.chat = { token: value, data: decodeChatToken(value) };
    } catch (error) {
      console.log('setChatToken');
      console.log(error);
    }
  }

  private fetchMainTokens(
    url: string,
    body: any,
    options: { headers?: HttpHeaders } = {}
  ): Observable<TokenResponse> {
    return this.httpClient.post<TokenResponse>(url, body, options).pipe(
      tap((response) => {
        this.accessToken = response.access_token;
        this.refreshToken = response.refresh_token;
        this.setNextRefreshTrigger(TokenToRefresh.access);
      })
    );
  }

  private fetchChatToken(): Observable<TokenResponse> {
    return this.httpClient
      .post<TokenResponse>(
        this.chatUrl.token(),
        {},
        { headers: this.refreshHeader }
      )
      .pipe(
        tap((response) => {
          this.chatToken = response.access_token;
          this.setNextRefreshTrigger(TokenToRefresh.chat);
        })
      );
  }

  private fetchAuthTokens(): Observable<PersistedAuthTokens> {
    return from(Storage.get({ key: AUTH_TOKENS })).pipe(
      pluck('value'),
      map((tokens) => JSON.parse(tokens) as PersistedAuthTokens),
      tap((tokens) => {
        if (tokens) {
          this.setAccessToken(tokens.access);
          this.setRefreshToken(tokens.refresh);
          this.setChatToken(tokens.chat);
        }
      })
    );
  }

  private fetchAuthSteps(): Observable<AuthSteps> {
    return from(Storage.get({ key: AUTH_STEPS })).pipe(
      pluck('value'),
      map((steps) => {
        if (steps) {
          const steps$ = JSON.parse(steps);

          if (steps$.phoneNumber) {
            steps$.phoneNumber = parsePhoneNumber(steps$.phoneNumber);
          }

          return steps$;
        }
      }),
      tap((steps) => (this.steps = steps || { redirectTo: 'home' }))
    );
  }

  private setNextRefreshTrigger(tokenType: TokenToRefresh) {
    let token: { exp: Date };

    switch (tokenType) {
      case TokenToRefresh.access:
        token = this.tokens.access ? this.tokens.access.data : null;
        break;

      case TokenToRefresh.chat:
        token = this.tokens.chat ? this.tokens.chat.data : null;
        break;
    }

    if (token) {
      const delay: number = token.exp.getTime() - new Date().getTime() - 6e4;

      console.log(
        `Refresh for '${tokenType} token' will happen in ${Math.round(
          delay / 1000
        )} seconds`
      );

      setTimeout(
        () => this.refreshTrigger.next(tokenType),
        Math.max(delay, 1000)
      );
    }
  }

  private handleFailedOtpSubmit(error) {
    if (this.networkService.networkState === NetworkState.offline) {
      this.alertNoNetwork();
    } else if (error.status === 401) {
      console.log(error);

      if (!error.error.detail.remaining_attempts) this.removeOtpSid();

      this.popUp.alert.next({
        header: error.error.detail.message || 'Something Went Wrong',
        message: 'Please make sure your input is correct.',
        buttons: ['OK'],
      });
    } else {
      this.alertDebug(error);
    }
  }

  private alertNoNetwork() {
    this.popUp.alert.next({
      header: 'No Network',
      message: 'Please make sure you have internet access.',
      buttons: ['OK'],
    });
  }

  private alertDebug(error) {
    this.popUp.alert.next({
      header: 'Something Went Wrong',
      message: JSON.stringify(error),
      buttons: ['OK'],
    });
  }

  private showLoading(message: string = null) {
    this.popUp.loading.next({ action: LoadingState.show, message });
  }

  hideLoading() {
    this.popUp.loading.next({ action: LoadingState.hide });
  }

  requestOtpOnStart(): Observable<OtpResponse> {
    return this.countdown$.resume().pipe(
      filter((remaining) => this.phoneNumber && (!remaining || !this.otpSid)),
      switchMap(() => this.requestOtp())
    );
  }

  hasAccess(): Observable<boolean> {
    if (this.tokens.refresh) return of(true);

    return this.fetchAuthTokens().pipe(
      map((tokens: PersistedAuthTokens) =>
        tokens && tokens.refresh ? true : false
      )
    );
  }

  newUser(): Observable<boolean> {
    if (this.tokens.access) {
      return of(this.tokens.access.data.scope.includes(UserScope.create));
    }

    return this.fetchAuthTokens().pipe(
      map(() => this.tokens.access.data.scope.includes(UserScope.create))
    );
  }

  refreshAccessToken(): Observable<TokenResponse> {
    return this.handleTokenRefresh(TokenToRefresh.access).pipe(
      finalize(() => (this.skipRefresh = true))
    );
  }

  requestOtp(forceSend: boolean = true): Observable<OtpResponse> {
    if (this.countdown$.ended || forceSend || this.phoneNumberChanged) {
      this.showLoading('requesting OTP');

      const body: OtpRequest = {
        phone_number: this.steps.phoneNumber.number as string,
      };

      return this.httpClient.post<OtpResponse>(this.userUrl.otp(), body).pipe(
        finalize(() => this.hideLoading()),
        tap({
          next: (response: OtpResponse) => {
            this.otpSid = response.sid;
            this.countdown$.start();
          },
          error: (error) => {
            this.networkService.networkState === NetworkState.offline
              ? this.alertNoNetwork()
              : this.alertDebug(error);
          },
        })
      );
    }

    return EMPTY;
  }

  requestToken(otpCode: string): Observable<TokenResponse> {
    this.showLoading('submitting OTP');

    const body = new FormData();
    body.append('username', this.otpSid);
    body.append('password', otpCode);

    return this.fetchMainTokens(this.userUrl.token(), body).pipe(
      finalize(() => this.hideLoading()),
      tap({
        next: () => {
          this.removeOtpSid();
          this.fetchChatToken().subscribe();
        },
        error: (error) => this.handleFailedOtpSubmit(error),
      })
    );
  }
}
