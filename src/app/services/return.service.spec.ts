import { TestBed } from '@angular/core/testing';

import { ReturnService } from './return.service';

describe('ReturnService', () => {
  let service: ReturnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReturnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
