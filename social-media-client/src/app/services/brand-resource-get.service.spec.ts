import { TestBed } from '@angular/core/testing';

import { BrandResourceGetService } from './brand-resource-get.service';

describe('BrandResourceGetService', () => {
  let service: BrandResourceGetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrandResourceGetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
