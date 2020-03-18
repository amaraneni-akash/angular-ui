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
    }, err => {
      if (err) {
        this.chartData = [{
          name: 'Speedometer Chart',
          type: 'speedometer',
          data: '60',
        }, {
          name: 'Progress Bar Chart',
          type: 'progressBar',
          data: '40',
        }, {
          name: 'Donut Chart',
          type: 'donut',
          data: '[{ "name": "Pen", "value": 40 }, { "name": "Pencil", "value": 60 }]',
        }, {
          name: 'Vertical Bar Chart',
          type: 'barChart',
          data: `[{ "name": "Q4 FY15", "value": 70 },{ "name": "Q1 FY16", "value": 30 },
          { "name": "Q2 FY16", "value": 50 },{ "name": "Q3 FY16", "value": 45 },
          { "name": "Q4 FY16", "value": 25 },{ "name": "Q1 FY17", "value": 15 },
          { "name": "Q2 FY17", "value": 85 }, { "name": "Q3 FY17", "value": 85 },
          { "name": "Q4 FY17", "value": 25 },{ "name": "Q1 FY18", "value": 95 }]`,
        }];
      }
    });
  }
}
