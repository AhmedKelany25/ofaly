import { Plugins } from '@capacitor/core';

import { from, interval, Observable, Subscription, Subject } from 'rxjs';
import { take, map, pluck, tap } from 'rxjs/operators';

import { Countdown as ComponentType } from './auth.interfaces';
import { toTimer } from '../utils/auth.utils';

const { Storage } = Plugins;

const COUNTDOWN_START = 'countdownStart';

export class Countdown implements ComponentType {
  private readonly duration: number;
  private readonly hasEnded: Subject<void> = new Subject();
  private startedAt: Date;
  private value$: string = toTimer(0);
  private counter: Subscription;

  constructor(duration: number) {
    this.duration = duration * 1000;
  }

  private get remaining(): number {
    const now: Date = new Date();
    const millisecondsLeft: number = this.startedAt
      ? this.startedAt.getTime() + this.duration - now.getTime()
      : 0;

    return Math.round(millisecondsLeft / 1000);
  }

  get value(): string {
    return this.value$;
  }

  get ended(): boolean {
    const now: Date = new Date();

    return (
      !this.startedAt ||
      now.getTime() - this.startedAt.getTime() > this.duration
    );
  }

  private setStart(timestamp: Date) {
    if (this.counter) this.counter.unsubscribe();

    const now: Date = new Date();

    if (now.getTime() - timestamp.getTime() > this.duration) {
      Storage.remove({ key: COUNTDOWN_START });
    } else {
      this.startedAt = timestamp;

      this.counter = interval(1000)
        .pipe(take(this.remaining))
        .subscribe({
          next: () => {
            this.value$ = toTimer(this.remaining);
          },
          complete: () => this.hasEnded.next(),
        });
    }
  }

  resume(): Observable<number> {
    return from(Storage.get({ key: COUNTDOWN_START })).pipe(
      pluck('value'),
      map((start) => (start ? new Date(start) : null)),
      tap((start) => (start ? this.setStart(start) : null)),
      map(() => this.remaining)
    );
  }

  start() {
    const now = new Date();
    Storage.set({ key: COUNTDOWN_START, value: now.toString() });
    this.setStart(now);
  }

  stop() {
    delete this.startedAt;
    this.value$ = toTimer(0);
    if (this.counter) this.counter.unsubscribe();
    Storage.remove({ key: COUNTDOWN_START });
  }

  onEnd(): Observable<void> {
    return this.hasEnded.pipe();
  }
}
