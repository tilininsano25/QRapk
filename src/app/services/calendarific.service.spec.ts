import { TestBed } from '@angular/core/testing';

import { CalendarificService } from './calendarific.service';

describe('CalendarificService', () => {
  let service: CalendarificService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarificService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
