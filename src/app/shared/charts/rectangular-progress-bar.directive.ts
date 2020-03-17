import { Directive, OnInit, OnChanges, Input, ElementRef, HostListener } from '@angular/core';

import * as d3 from 'd3';
import d3Tip from 'd3-tip';

@Directive({
  selector: '[appRectangularProgressBar]'
})
export class RectangularProgressBarDirective implements OnInit, OnChanges {

  @Input() data: any;
  @Input() barheight = 30;
  @Input() margin = { top: 5, right: 20, bottom: 5, left: 15 };
  @Input() colors = ['#2CB584', '#F3F3F3'];
  public width = 240;
  public height = 290;

  constructor(public element: ElementRef) { }

  public tip = d3Tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html((d) => {
      return `<div>${this.data}% Completed.
      </div>`;
    });

  ngOnInit() {
    // this.data = 30;
    this.drawChart();
  }

  ngOnChanges() {
    this.drawChart();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.drawChart();
  }

  drawChart() {
    this.width = (this.element.nativeElement.offsetWidth > 0) ? this.element.nativeElement.offsetWidth : 40;
    this.height = (this.height < 1) ? 240 : this.height;
    let svg = d3.select(this.element.nativeElement);
    svg.selectAll('*').remove();
    svg = d3.select(this.element.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'rectangularBarChart');

    const width = +svg.attr('width') - this.margin.left - this.margin.right;
    const height = +svg.attr('height') - this.margin.top - this.margin.bottom - 15;

    const g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + (this.margin.top + (height - this.barheight) / 2) + ')');

    const gVal = g.selectAll('.bar')
      .data([this.data * width / 100, (100 - this.data) * width / 100])
      .enter();

    const self = this;

    gVal.append('rect')
      .attr('class', '')
      .attr('x', (d, i) => {
        if (i === 0) {
          return 0;
        }
        return this.data * width / 100;
      })
      .attr('height', this.barheight)
      .attr('y', 0)
      .attr('width', d => d)
      .attr('fill', (d, i) => {
        return this.colors[i];
      })
      .on('mouseover', (d, i, n) => { if (i === 0) { return self.tip.show(d, n[i]); } })
      .on('mouseout', (d, i, n) => self.tip.hide(d, n[i]));

    g.call(this.tip);

  }
}
