import { TestBed } from '@angular/core/testing';

import { PatientExistGuard } from './patient-exist.guard';

describe('PatientExistGuard', () => {
  let guard: PatientExistGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PatientExistGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
