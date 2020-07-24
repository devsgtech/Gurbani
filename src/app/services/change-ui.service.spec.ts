import { TestBed } from '@angular/core/testing';

import { ChangeUIService } from './change-ui.service';

describe('ChangeUIService', () => {
  let service: ChangeUIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangeUIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
