import { Component, OnInit } from '@angular/core';
import * as data from '../../assets/hierarchy.json';

@Component({
  selector: 'app-list-container',
  templateUrl: './list-container.component.html',
  styleUrls: ['./list-container.component.css']
})
export class ListContainerComponent implements OnInit {
  hierarchy = {relationships:[]};

  constructor() { 
  }

  ngOnInit() {
    this.hierarchy = (<any>data);
    console.log(this.hierarchy);
  }

}
