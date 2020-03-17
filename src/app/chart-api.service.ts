import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChartAPIService {

  constructor(private http: HttpClient) { }

  getChartData() {
    return this.http.get('http://localhost:4000/api/charts').pipe(
      map(res => res));
  }
}
