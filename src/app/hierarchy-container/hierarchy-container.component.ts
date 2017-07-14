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
    d3.json("../../assets/hierarchy.json", data => this.generateTree(data));
  }

  ngAfterViewInit() {

  }

  generateTree(data) {
    this.rawFamilyTreeJSON = data;
    this.familyTree = d3.hierarchy(data, function (d) {
      return d.relationships;
    })
    console.log("RAW JSON:");
    console.log(this.rawFamilyTreeJSON);
    console.log("D3 TREE:");
    console.log(this.familyTree);

    var treeChart = d3.tree();
    console.log("TREE CHART:");
    console.log(treeChart);
    treeChart.size([400, 400]);

    var treeData = treeChart(this.familyTree).descendants()
    console.log("D3 TREE DESCENDANTS:")
    console.log(treeData);
    var depthScale = d3.scaleOrdinal().range(["#5EAFC6", "#FE9922", "#93c464", "#75739F"])
    console.log(treeData)

    /* Save handle to the main angular context so it can be referenced from within d3 context */
    var angularCtx = this;
    this.scaffoldTreeVisualization(treeData);

  }

  scaffoldTreeVisualization(treeData) {
    console.log("D3 TREE DESCENDANTS:")
    console.log(treeData);
    var depthScale = d3.scaleOrdinal().range(["#5EAFC6", "#FE9922", "#93c464", "#75739F"])
    console.log(treeData)

    /* Save handle to the main angular context so it can be referenced from within d3 context */
    var angularCtx = this;

    //d3.select("#treeG").remove();

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
      .style("stroke-width", "2px");

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


      //lines.exit().remove();
      //nodes.exit().remove();

      /*d3.select("#treeG").selectAll("line")
      .data(treeData.filter(d => d.parent)).exit().remove();*/
  }

  showDialogForFamilyMember(memberData, context) {
    console.log(memberData);
    let dialogRef = this.dialog.open(DetailDialogComponent, memberData);
    dialogRef.afterClosed().subscribe(result => {
      if (result.action === "delete") {
        this.deleteFromTree(result, memberData);
      }
      if (result.action === "insert") {

      }
      if (memberData.action === "edit") {
        // TODO
      }
    })
  }

  deleteFromTree(member, memberData) {
    console.log("Deleting in CONTEXT:");
    console.log(this);
    console.log("Deleting MEMBER:");
    console.log(member);
    console.log("Deleting MEMBER DATA:");
    console.log(memberData);
    //this.findAndRemove2(memberData, this.familyTree, 0);
    this.findAndRemove(memberData, this.rawFamilyTreeJSON, 0);
  }

  findAndRemove(target, currNode, foundIndex) {

  }

  findAndRemove2(target, currNode, foundIndex) {
    var numChildren = 0;
    if (currNode && currNode.children) {
      numChildren = currNode.children.length;
    }
    var idx = 0;

    if (currNode && currNode.data && (target.data.name === currNode.data.name)) {
      currNode.parent.children.splice(foundIndex, 1);
      if (currNode.parent.children.length == 0) {
        /* d3 tree does not accept empty children arrays */
        currNode.parent.children = null;
      }
      var treeChart = d3.tree()
      var treeData = treeChart(this.familyTree).descendants()
      var lineID = "#line-" + target.data.name;
      var nodeID = "#node-" + target.data.name;
      //d3.select("#treeG").select(lineID).remove()
      //d3.select(nodeID).remove();
      //d3.select("#treeG").remove();
      // this works! d3.select(lineID).remove();
      //d3.select("svg").html(null);
      //d3.selectAll("g.node").data(treeData).filter(d => target.data.name === d.data.name).exit().remove();
      //d3.select(nodeID).remove();
      //d3.select(lineID).remove();
      //d3.selectAll("g.node").data(treeData).exit().remove();
      /*d3.selectAll("g.node").data(treeData).filter(function (d) {
        return d.data.name === target.data.name;
      }).exit().remove();*/

      this.scaffoldTreeVisualization(treeData);
      console.log("found it!");
      console.log(this.familyTree);
      return;
    } else {
      for (idx = 0; idx < numChildren; idx++) {
        console.log("still looking...");
        this.findAndRemove(target, currNode.children[idx], idx);
      }
    }
  }

  insertIntoTree(parent, child) {

  }



  highlightPathToRootMember(memberData) {
    console.log(memberData)
  }


}
