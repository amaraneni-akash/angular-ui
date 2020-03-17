import { Directive, OnInit, OnChanges, Input, ElementRef, HostListener } from '@angular/core';

import * as d3 from 'd3';
import d3Tip from 'd3-tip';

@Directive({
  selector: '[appVerticalBarChart]'
})
export class VerticalBarChartDirective implements OnInit, OnChanges {

  @Input() data: any;
  @Input() barWidth = 25;
  @Input() margin = { top: 15, right: 20, bottom: 50, left: 50 };
  @Input() color = '#115E7C';
  @Input() leftYLabel = 'Values in Counts';
  public width = 240;
  public height = 290;
  public legends = [];

  constructor(public element: ElementRef) { }

  public tip = d3Tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html((d) => {
      return `<div><div>Name:${d.name}</div><div>Value:${d.value}</div></div>`;
    });

  ngOnInit() {
    this.data = JSON.parse(this.data);
    if (Array.isArray(this.data)) {
      this.drawChart();
    }
  }

  ngOnChanges() {
    if (Array.isArray(this.data)) {
      this.drawChart();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.drawChart();
  }

  drawChart() {
    const self = this;
    this.width = this.element.nativeElement.offsetWidth;
    this.height = (this.height < 1) ? 240 : this.height;
    let svg = d3.select(this.element.nativeElement);
    svg.selectAll('*').remove();
    svg = d3.select(this.element.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'verticalBarChart');

    const width = +svg.attr('width') - this.margin.left - this.margin.right;
    const height = +svg.attr('height') - this.margin.top - this.margin.bottom - 15;

    const x = d3.scaleBand().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    x.domain(this.data.map(d => d.name)).padding(0.8);
    y.domain([0, d3.max(this.data, d => d.value)]).nice();

    g.append('g')
      .attr('class', 'x axis tickhide')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x)
        .tickSizeOuter(0));

    g.append('g')
      .attr('class', 'y axis')
      .call(d3.axisLeft(y).ticks(4).tickFormat((d) => {
        return d;
      }).tickSizeInner([-width]).tickSizeOuter(0));

    const gVal = g.selectAll('.bar')
      .data(this.data)
      .enter();

    gVal.append('rect')
      .attr('class', '')
      .attr('x', d => x(d.name) + (x.bandwidth() - this.barWidth) / 2)
      .attr('height', d => y(0) - y(d.value))
      .attr('y', d => y(d.value))
      .attr('width', this.barWidth)
      .attr('fill', this.color).on('mouseover', (d, i, n) => self.tip.show(d, n[i]))
      .on('mouseout', (d, i, n) => self.tip.hide(d, n[i]));

    g.call(this.tip);

    const table = d3.select(this.element.nativeElement).append('table');
    const legend = table.attr('class', 'legend normal-style');
    const tr = legend.append('tr');
    const td = tr.selectAll('td').data(this.legends).enter().append('td');

    td.append('text')
      .attr('class', 'clear-link')
      .text((d, i) => d.charAt(0).toUpperCase() + d.slice(1) // code added to make first letter of string to uppercase
      );

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - this.margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .attr('class', 'x-l-legend-bbc1')
      .style('text-anchor', 'middle')
      .text(this.leftYLabel);
  }
}
