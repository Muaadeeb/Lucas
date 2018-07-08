import { TestBed, inject } from '@angular/core/testing';

import { VerdictService } from './verdict.service';

describe('VerdictService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VerdictService]
    });
  });

  it('should be created', inject([VerdictService], (service: VerdictService) => {
    expect(service).toBeTruthy();
  }));
});
