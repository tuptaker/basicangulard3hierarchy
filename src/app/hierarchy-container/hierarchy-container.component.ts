import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-hierarchy-container',
  templateUrl: './hierarchy-container.component.html',
  styleUrls: ['./hierarchy-container.component.css']
})
export class HierarchyContainerComponent implements OnInit {
  familyTree = {}

  constructor() { }

  ngOnInit() {
    d3.json("../../assets/hierarchy.json", data => this.generateTree(data));
  }

  ngAfterViewInit() {

  }

  generateTree(data) {
    this.familyTree = d3.hierarchy(data, function (d) {
      return d.relationships;
    })
        var treeChart = d3.tree();
    treeChart.size([400, 400])

    var treeData = treeChart(this.familyTree).descendants()
    var depthScale = d3.scaleOrdinal().range(["#5EAFC6", "#FE9922", "#93c464", "#75739F"])

    d3.select("svg")
      .append("g")
      .attr("id", "treeG")
      .attr("transform", "translate(60,20)")
      .selectAll("g")
      .data(treeData)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => "translate(" + d.x + "," + d.y + ")")
    d3.selectAll("g.node")
      .append("circle")
      .attr("r", 10)
      .style("fill", d => depthScale(d.depth))
      .style("stroke", "white")
      .style("stroke-width", "2px");
    d3.select("#treeG").selectAll("line")
      .data(treeData.filter(d => d.parent))
      .enter().insert("line", "g")
      .attr("x1", d => d.parent.x)
      .attr("y1", d => d.parent.y)
      .attr("x2", d => d.x)
  }



}
