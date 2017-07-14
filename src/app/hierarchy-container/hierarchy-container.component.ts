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
  canvasHeight = 700;
  canvasWidth = 700;
  treeContainerOffset = 80;

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
    var treeWidth = this.canvasWidth - this.treeContainerOffset;
    var treeHeight = this.canvasHeight - this.treeContainerOffset;

    this.familyTree = d3.hierarchy(this.rawFamilyTreeJSON, function (d) {
      return d.relationships;
    })

    var treeChart = d3.tree();

    treeChart.size([treeWidth, treeHeight]);
    var treeData = treeChart(this.familyTree).descendants()
    var depthScale = d3.scaleOrdinal().range(["#5EAFC6", "#FE9922", "#93c464", "#75739F"])
    /* Save handle to the main angular context so it can be referenced from within d3 context */
    var angularCtx = this;

    d3.select("#treeG").remove();

    d3.select("svg")
      .append("g")
      .attr("id", "treeG")
      .attr("transform", "translate(" + this.treeContainerOffset/2 + "," + this.treeContainerOffset/2 + ")")
      .selectAll("g")
      .data(treeData)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => "translate(" + d.x + "," + (treeWidth - d.y) + ")")

    var nodes = d3.selectAll("g.node")
      // set unique IDs on the node so we can delete them later
      .attr("id", d => ("node-" + d.data.name))
      .append("circle")
      // pass the main angular context into d3 so angular methods can be called from within d3 context 
      .on("click", function (selectedNode) {
        return angularCtx.showDialogForFamilyMember(selectedNode, angularCtx);
      })
      .attr("r", 15)
      .style("fill", d => depthScale(d.depth))
      .style("stroke-width", "2px")

      d3.selectAll("g.node").append("text")
      .attr("y", 30)
      .attr("x", -15)
      .text(d => d.data.name);

    var lines = d3.select("#treeG").selectAll("line")
      .data(treeData.filter(d => d.parent))
      .enter().insert("line", "g")
      .attr("x1", d => d.parent.x)
      .attr("y1", d => treeWidth - d.parent.y)
      .attr("x2", d => d.x)
      .attr("y2", d => treeWidth - d.y)
      .style("stroke", "black")

      // set unique IDs on the node so we can delete them later
      d3.selectAll("line")
      .attr("id", d => ("line-" + d.data.name))
  }

  showDialogForFamilyMember(memberData, context) {
    let dialogRef = this.dialog.open(DetailDialogComponent, memberData);
    dialogRef.afterClosed().subscribe(result => {
      if (result.action === "delete") {
         this.deleteFromTree(memberData, this.rawFamilyTreeJSON, null, 0);
      }
      if (result.action === "insert") {
        this.insertIntoTree(result.member, this.rawFamilyTreeJSON, result.newrelation);
      }
      if (result.action === "edit") {
        this.updateNodeInTree(result.node, this.rawFamilyTreeJSON, result.updatedNode);
      }
    })
  }

  updateNodeInTree(targetNode, currNode, updatedNode) {
        var numChildren = 0;
    if (currNode && currNode.relationships) {
      numChildren = currNode.relationships.length;
    }
    var idx = 0;

    if (currNode && (targetNode.name === currNode.name)) {
      currNode.name = updatedNode.name;
      currNode.relationshiptype = updatedNode.relationshiptype
      this.scaffoldTreeVisualization();
    } else {
      for (idx = 0; idx < numChildren; idx++) {
        this.updateNodeInTree(targetNode, currNode.relationships[idx], updatedNode);
      }
    }
  }

  /* Typically, this will be called with parentNode set to tree root and function recurses from there. */
  deleteFromTree(targetNode, currNode, parentNode, foundIndex) {
    var numChildren = 0;
    if (currNode && currNode.relationships) {
      numChildren = currNode.relationships.length;
    }
    var idx = 0;

    if (parentNode && currNode && (targetNode.data.name === currNode.name)) {
      parentNode.relationships.splice(foundIndex, 1);
      this.scaffoldTreeVisualization();
    } else {
      for (idx = 0; idx < numChildren; idx++) {
        this.deleteFromTree(targetNode, currNode.relationships[idx], currNode, idx);
      }
    }
  }

  insertIntoTree(targetNode, currNode, newChildNode) {
    var numChildren = 0;
    if (currNode && currNode.relationships) {
      numChildren = currNode.relationships.length;
    }
    var idx = 0;

    if (currNode && (targetNode.name === currNode.name)) {
      currNode.relationships.push(newChildNode);
      this.scaffoldTreeVisualization();
    } else {
      for (idx = 0; idx < numChildren; idx++) {
        this.insertIntoTree(targetNode, currNode.relationships[idx], newChildNode);
      }
    }
  }

  highlightPathToRootMember(memberData) {
    console.log(memberData)
  }

}
