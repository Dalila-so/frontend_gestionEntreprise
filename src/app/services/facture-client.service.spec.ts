import { TestBed } from '@angular/core/testing';

import { FactureClientService } from './facture-client.service';

describe('FactureClientService', () => {
  let service: FactureClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FactureClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
