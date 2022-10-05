import { TestBed } from '@angular/core/testing';

import { ResourceUpdateService } from './resource-update.service';

describe('ResourceUpdateService', () => {
  let service: ResourceUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
