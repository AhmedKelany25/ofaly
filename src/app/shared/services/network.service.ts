import { Injectable } from '@angular/core';

import { fromEvent, merge, Observable, of } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';

import { NetworkState } from '../models/shared.enums';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private networkState$: NetworkState;

  constructor() {
    this.trackNetworkState().subscribe((state) => (this.networkState$ = state));
  }

  get networkState(): NetworkState {
    return this.networkState$;
  }

  trackNetworkState(): Observable<NetworkState> {
    return merge<NetworkState>(
      fromEvent(window, 'online').pipe(mapTo(NetworkState.online)),
      fromEvent(window, 'offline').pipe(mapTo(NetworkState.offline)),
      of(navigator.onLine).pipe(
        map((online) => (online ? NetworkState.online : NetworkState.offline))
      )
    );
  }
}
