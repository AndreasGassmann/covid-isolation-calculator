import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-from-to',
  templateUrl: './from-to.component.html',
  styleUrls: ['./from-to.component.scss']
})
export class FromToComponent implements OnInit {
  @Input() title: string | undefined
  @Input() data: any

  constructor() { }

  ngOnInit(): void {
  }

}
