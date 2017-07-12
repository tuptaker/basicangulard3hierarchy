import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import * as d3 from "d3";
import { MdDialog } from '@angular/material';
import { DetailDialogComponent } from '../detail-dialog/detail-dialog.component';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-hierarchy-container',
  templateUrl: './hierarchy-container.component.html',
  styleUrls: ['./hierarchy-container.component.css']
})
export class HierarchyContainerComponent implements OnInit {
  familyTree = {}

  constructor(public dialog: MdDialog, @Inject(DOCUMENT) doc: any) { }

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
    console.log(treeData)

    /* Save handle to the main angular context so it can be referenced from within d3 context */
    var angularCtx = this;

    d3.select("svg")
      .append("g")
      .attr("id", "treeG")
      .attr("transform", "translate(60,20)")
      .selectAll("g")
      .data(treeData)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => "translate(" + d.x + "," + (400 - d.y) + ")")
    d3.selectAll("g.node")
      .append("circle")

      /* pass the main angular context into d3 so angular methods can be called from within d3 context */
      .on("click", function (selectedNode) {
        return angularCtx.showDialogForFamilyMember(selectedNode, angularCtx);
      })
      .attr("r", 10)
      .style("fill", d => depthScale(d.depth))
      .style("stroke-width", "2px");
    d3.select("#treeG").selectAll("line")
      .data(treeData.filter(d => d.parent))
      .enter().insert("line", "g")
      .attr("x1", d => d.parent.x)
      .attr("y1", d => 400 - d.parent.y)
      .attr("x2", d => d.x)
      .attr("y2", d => 400 - d.y)
      .style("stroke", "black")
  }

  showDialogForFamilyMember(memberData, context) {
    console.log(memberData)
    setTimeout(() => {
      let dialogRef = this.dialog.open(DetailDialogComponent, memberData);
      //dialogRef.componentInstance.selectedMember = memberData;

      /*
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      });
      */
    }, 0)
  }

  highlightPathToRootMember(memberData) {
    console.log(memberData)
  }



}
