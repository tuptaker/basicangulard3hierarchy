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
  familyTree = { data: { name: "" }, children: null }
  rawFamilyTreeJSON = {}

  constructor(public dialog: MdDialog, @Inject(DOCUMENT) doc: any) { }

  ngOnInit() {
    d3.json("../../assets/hierarchy.json", d => this.initializeTree(d));
  }

  ngAfterViewInit() {
  }

  initializeTree(data) {
    this.rawFamilyTreeJSON = data;
    this.scaffoldTreeVisualization();
  }

  scaffoldTreeVisualization() {
    this.familyTree = d3.hierarchy(this.rawFamilyTreeJSON, function (d) {
      return d.relationships;
    })

    var treeChart = d3.tree();
    treeChart.size([400, 400]);
    var treeData = treeChart(this.familyTree).descendants()
    var depthScale = d3.scaleOrdinal().range(["#5EAFC6", "#FE9922", "#93c464", "#75739F"])
    /* Save handle to the main angular context so it can be referenced from within d3 context */
    var angularCtx = this;

    d3.select("#treeG").remove();

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

    var nodes = d3.selectAll("g.node")
      // set unique IDs on the node so we can delete them later
      .attr("id", d => ("node-" + d.data.name))
      .append("circle")
      // pass the main angular context into d3 so angular methods can be called from within d3 context 
      .on("click", function (selectedNode) {
        return angularCtx.showDialogForFamilyMember(selectedNode, angularCtx);
      })
      .attr("r", 10)
      .style("fill", d => depthScale(d.depth))
      .style("stroke-width", "2px")

    var lines = d3.select("#treeG").selectAll("line")
      .data(treeData.filter(d => d.parent))
      .enter().insert("line", "g")
      .attr("x1", d => d.parent.x)
      .attr("y1", d => 400 - d.parent.y)
      .attr("x2", d => d.x)
      .attr("y2", d => 400 - d.y)
      .style("stroke", "black")

      // set unique IDs on the node so we can delete them later
      d3.selectAll("line")
      .attr("id", d => ("line-" + d.data.name))
  }

  showDialogForFamilyMember(memberData, context) {
    let dialogRef = this.dialog.open(DetailDialogComponent, memberData);
    dialogRef.afterClosed().subscribe(result => {
      if (result.action === "delete") {
        this.deleteFromTree(result, memberData);
      }
      if (result.action === "insert") {
        // TODO
      }
      if (memberData.action === "edit") {
        // TODO
      }
    })
  }

  deleteFromTree(member, memberData) {
    this.findAndRemove(memberData, this.rawFamilyTreeJSON, null, 0);
  }

  findAndRemove(target, currNode, parentNode, foundIndex) {
    var numChildren = 0;
    if (currNode && currNode.relationships) {
      numChildren = currNode.relationships.length;
    }
    var idx = 0;

    if (parentNode && currNode && (target.data.name === currNode.name)) {
      parentNode.relationships.splice(foundIndex, 1);
      this.scaffoldTreeVisualization();
    } else {
      for (idx = 0; idx < numChildren; idx++) {
        this.findAndRemove(target, currNode.relationships[idx], currNode, idx);
      }
    }

  }

  insertIntoTree(parent, child) {
  }

  highlightPathToRootMember(memberData) {
    console.log(memberData)
  }

}
