import { TestBed } from '@angular/core/testing';

import { ResourceSearchService } from './resource-search.service';

describe('ResourceSearchService', () => {
  let service: ResourceSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
