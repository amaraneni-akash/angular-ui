import { Directive, OnInit, OnChanges, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';

@Directive({
  selector: '[appDonutChart]'
})
export class DonutChartDirective implements OnInit, OnChanges {

  @Input() chartData;
  @Input() color = ['#F47942', '#FBB04E', '#B66353', '#4F6980', '#849DB1', '#A2CEAA', '#638B66', '#BFBB60'];
  @Input() width = 200;
  @Input() height = 220;
  @Input() internalDepth = 45;

  public tip = d3Tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html((d) => {
      const keyArray = Object.keys(d.data);
      return `<div><div>${keyArray[0]}:${d.data[keyArray[0]]}</div><div>${keyArray[1]}:${d.data[keyArray[1]]}</div></div>`;
    });

  constructor(private element: ElementRef) { }

  ngOnChanges() {
    if (Array.isArray(this.chartData)) {
      this.drawChart();
    }
  }

  ngOnInit() {
    this.chartData = JSON.parse(this.chartData);
    if (Array.isArray(this.chartData)) {
      this.drawChart();
    }
  }

  drawChart() {
    this.width = (this.element.nativeElement.offsetWidth > 0) ? this.element.nativeElement.offsetWidth : 40;
    this.height = (this.height < 1) ? 240 : this.height;
    const radius = Math.min(this.width, this.height) / 2;
    const arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - this.internalDepth)
      .padAngle(.02);

    const pie = d3.pie()
      .sort(null)
      .value((d) => d[Object.keys(d)[1]]);

    let svg = d3.select(this.element.nativeElement);
    svg.selectAll('*').remove();
    svg = d3.select(this.element.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');

    const g = svg.selectAll('.arc')
      .data(pie(this.chartData))
      .enter().append('g')
      .attr('class', 'arc');

    const self = this;

    g.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => self.color[i])
      .on('mouseover', (d, i, n) => self.tip.show(d, n[i]))
      .on('mouseout', (d, i, n) => self.tip.hide(d, n[i]));

    g.call(this.tip);
  }
}
