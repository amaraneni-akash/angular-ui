import { Directive, OnInit, OnChanges, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';

@Directive({
  selector: '[appSpeedometer]'
})
export class SpeedometerDirective implements OnInit, OnChanges {

  @Input() data: number;
  @Input() color = ['#EC932F', '#F3F3F3', '#FFFFFF'];
  @Input() width = 200;
  @Input() height = 220;
  @Input() internalDepth = 45;
  public chartData = [{ name: 'a', value: 33.5 }, { name: 'b', value: 33.5 }, { name: 'c', value: 33.5 }];
  public tip = d3Tip()
    .attr('class', 'd3-tip')
    .offset([-30, 20])
    .html((d) => {
      return `<div>${this.data}% Completed.</div>`;
    });

  constructor(private element: ElementRef) { }

  ngOnChanges() {
    this.drawChart();
  }

  ngOnInit() {
    const nearestTenMultiple = Math.round(this.data / 10) * 10; // Make number to closest multiple of 10
    this.chartData[0].value = nearestTenMultiple * 67 / 100;
    this.chartData[1].value = 67 - this.chartData[0].value;
    this.drawChart();
  }

  drawChart() {
    // const tooltip = d3.select('body').append('div').attr('class', 'toolTip');
    // const len = this.chartData.length;
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
    const rotate = 155 / Math.PI * 180;
    let svg = d3.select(this.element.nativeElement);
    svg.selectAll('*').remove();
    svg = d3.select(this.element.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ') rotate(' + rotate + ')');

    const g = svg.selectAll('.arc')
      .data(pie(this.chartData))
      .enter().append('g')
      .attr('class', 'arc');

    const self = this;

    g.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => (self.color[i]))
      .on('mouseover', (d, i, n) => { if (i === 0) { return self.tip.show(d, n[i]); } })
      .on('mouseout', (d, i, n) => self.tip.hide(d, n[i]));

    g.append('circle').attr('cx', 0).attr('cy', 0).attr('r', 5);

    g.append('line')
      .style('stroke', '#000000')
      .style('stroke-width', 5)
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', Math.cos(this.chartData[0].value - Math.PI / 2) * (radius))
      .attr('y2', Math.sin(this.chartData[0].value - Math.PI / 2) * (radius));

    g.call(this.tip);
  }
}


