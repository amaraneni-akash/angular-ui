import { Component, OnInit } from '@angular/core';
import { ChartAPIService } from './chart-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Angular-ui';
  chartData: any;

  constructor(public chartAPI: ChartAPIService) { }

  ngOnInit() {
    this.chartAPI.getChartData().subscribe(res => {
      if (res) {
        this.chartData = res;
      }
    });
  }
}
