import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { Alert, Loading } from '../models/shared.interfaces';

@Injectable({
  providedIn: 'root',
})
export class PopUpService {
  readonly loading: Subject<Loading> = new Subject();
  readonly alert: Subject<Alert> = new Subject();

  constructor() {}
}
