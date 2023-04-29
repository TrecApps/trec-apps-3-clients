import { TestBed } from '@angular/core/testing';

import { FalsehoodService } from './falsehood.service';

describe('FalsehoodService', () => {
  let service: FalsehoodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FalsehoodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
