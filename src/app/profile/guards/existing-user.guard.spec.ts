import { TestBed } from '@angular/core/testing';

import { ExistingUserGuard } from './existing-user.guard';

describe('ExistingUserGuard', () => {
  let guard: ExistingUserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ExistingUserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
