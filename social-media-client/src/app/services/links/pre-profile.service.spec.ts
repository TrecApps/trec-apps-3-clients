import { TestBed } from '@angular/core/testing';

import { PreProfileService } from './pre-profile.service';

describe('PreProfileService', () => {
  let service: PreProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
