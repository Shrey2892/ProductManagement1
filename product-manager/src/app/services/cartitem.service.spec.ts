import { TestBed } from '@angular/core/testing';

import { CartitemService } from './cartitem.service';

describe('CartitemService', () => {
  let service: CartitemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartitemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
