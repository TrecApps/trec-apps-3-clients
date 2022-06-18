import { TestBed } from '@angular/core/testing';

import { FalsehoodSetService } from './falsehood-set.service';

describe('FalsehoodSetService', () => {
  let service: FalsehoodSetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FalsehoodSetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
