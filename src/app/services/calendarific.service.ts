import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarificService {
  private apiKey: string = 'tXSQn9IViTtZOkLOC49rcWyiMRz3dp9H'; 
  private baseUrl: string = 'https://calendarific.com/api/v2/holidays';

  constructor(public httpClient: HttpClient) {}

  getHolidays(country: string, year: number): Observable<any> {
    const url = `${this.baseUrl}?api_key=${this.apiKey}&country=${country}&year=${year}&language=es`;
    return this.httpClient.get(url);
  }
}
