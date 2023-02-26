import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-small-widget',
  templateUrl: './small-widget.component.html',
  styleUrls: ['./small-widget.component.css']
})
export class SmallWidgetComponent implements OnInit {
  @Input() title: string = '';
  @Input() bgColor: string = '';
  @Input() content: string = '';
  @Input() imgSrc: string = '';

  constructor(
  ) {}

  ngOnInit(): void {
    console.log(this.title);
    console.log(this.bgColor);
  }
}
