import { TestBed } from '@angular/core/testing';

import { PortService } from './port.service';
import { TranslateModule } from '@ngx-translate/core';

describe('PortService', () => {
  let service: PortService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
    });
    service = TestBed.inject(PortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
