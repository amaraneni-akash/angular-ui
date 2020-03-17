import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SpeedometerDirective } from './shared/charts/speedometer.directive';
import { RectangularProgressBarDirective } from './shared/charts/rectangular-progress-bar.directive';
import { DonutChartDirective } from './shared/charts/donut-chart.directive';
import { VerticalBarChartDirective } from './shared/charts/vertical-bar-chart.directive';
import { ChartAPIService } from './chart-api.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    SpeedometerDirective,
    RectangularProgressBarDirective,
    DonutChartDirective,
    VerticalBarChartDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [ChartAPIService],
  bootstrap: [AppComponent]
})
export class AppModule { }
