import { TestBed } from '@angular/core/testing';

import { BonLivraisonService } from './bon-livraison.service';

describe('BonLivraisonService', () => {
  let service: BonLivraisonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BonLivraisonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
