import { TestBed } from '@angular/core/testing';

import { AutoAuthGuard } from './auto-auth.guard';

describe('AutoAuthGuard', () => {
  let guard: AutoAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AutoAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
