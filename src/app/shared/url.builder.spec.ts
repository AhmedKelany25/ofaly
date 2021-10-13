import { TestBed } from '@angular/core/testing';

import { ChatUrlBuilder } from './url.builder';

describe('ChatUrl.BuilderService', () => {
  let service: ChatUrlBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatUrlBuilder);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
