import { Component, OnInit, Input } from '@angular/core';
import * as data from '../../assets/hierarchy.json';

@Component({
  selector: 'app-list-container',
  templateUrl: './list-container.component.html',
  styleUrls: ['./list-container.component.css']
})
export class ListContainerComponent implements OnInit {
  @Input() hierarchy = (<any>data);
  relationships = [];

  constructor() { 
  }

  ngOnInit() {
  }

}
