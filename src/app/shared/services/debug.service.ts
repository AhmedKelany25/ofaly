import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DebugService implements HttpInterceptor {
  debug: boolean = false;

  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.debug) {
      console.log('<<<  HTTP REQUEST  >>>');
      console.log(JSON.stringify(request));
    }

    return next.handle(request).pipe(
      tap(
        (response) => {
          if (this.debug) {
            console.log('<<<  HTTP RESPONSE  >>>');
            console.log(JSON.stringify(response));
          }
        },
        (error) => {
          if (this.debug) {
            console.log('<<<  HTTP [ERROR] RESPONSE  >>>');
            console.log(JSON.stringify(error));
          }
        }
      )
    );
  }
}
