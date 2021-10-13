import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { from, Observable, of } from 'rxjs';
import { mergeMap, pluck, toArray } from 'rxjs/operators';

import { PhoneNumber } from 'libphonenumber-js';

import { AuthService } from 'src/app/auth/services/auth.service';
import { ChatUrlBuilder } from 'src/app/shared/url.builder';
import { HttpParameterCodec } from 'src/app/shared/models/shared.classes';
import { UserCreate, Users } from '../models/member.interfaces';
import { Member, MemberCreate, User } from '../models/member.interfaces';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private pageSize$: number = 50;

  constructor(
    private httpClient: HttpClient,
    private chatUrl: ChatUrlBuilder,
    private authService: AuthService
  ) {}

  createUser(): Observable<User> {
    const phoneNumber = this.authService.phoneNumber.number as string;

    const body: UserCreate = {
      friendly_name: phoneNumber,
      identity: phoneNumber,
      attributes: '{}',
    };

    return this.httpClient.post<User>(this.chatUrl.user(), body);
  }

  fetchUsers(phoneNumbers: PhoneNumber[]): Observable<User[]> {
    if (phoneNumbers.length === 0) return of([]);

    const paramsStream: HttpParams[] = [];

    for (
      let page = 0;
      page < Math.ceil(phoneNumbers.length / this.pageSize$);
      page++
    ) {
      let params = new HttpParams({ encoder: new HttpParameterCodec() });
      params = params.append('page_size', `${this.pageSize$}`);

      for (
        let i = page * this.pageSize$;
        i < Math.min((page + 1) * this.pageSize$, phoneNumbers.length);
        i++
      ) {
        let phoneNumber: PhoneNumber = phoneNumbers[i];

        params = params.append('identity', phoneNumber.number as string);
      }

      paramsStream.push(params);
    }

    return from(paramsStream).pipe(
      mergeMap((params) =>
        this.httpClient
          .get<Users>(this.chatUrl.user(), { params: params })
          .pipe(pluck<Users, User[]>('users'))
      )
    );
  }

  createMember(chatSid: string, phoneNumber: string): Observable<Member> {
    const body: MemberCreate = {
      attributes: '{}',
      identity: phoneNumber,
    };

    return this.httpClient.post<Member>(this.chatUrl.member(chatSid), body);
  }

  addMembers(
    chatSid: string,
    phoneNumbers: PhoneNumber[]
  ): Observable<Member[]> {
    if (phoneNumbers.length === 0) return of([]);

    const filteredPhoneNumbers: string[] = [];
    phoneNumbers.forEach((phoneNumber) => {
      let number = phoneNumber.number as string;
      if (!filteredPhoneNumbers.includes(number)) {
        filteredPhoneNumbers.push(number);
      }
    });

    return from(filteredPhoneNumbers).pipe(
      mergeMap((phoneNumber: string) =>
        this.createMember(chatSid, phoneNumber)
      ),
      toArray()
    );
  }
}
