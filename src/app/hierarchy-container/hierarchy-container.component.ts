import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-hierarchy-container',
  templateUrl: './hierarchy-container.component.html',
  styleUrls: ['./hierarchy-container.component.css']
})
export class HierarchyContainerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    d3.json("../../assets/hierarchy.json", d => console.log(d));
  }

}
