import { Component, Input, Output, Inject, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-detail-dialog',
  templateUrl: './detail-dialog.component.html',
  styleUrls: ['./detail-dialog.component.css']
})

export class DetailDialogComponent {
  editOrAddConfirmationLabel = "Save changes and close";
  deleteButtonIsVisible = true;
  currTypedNewRelationName: string;
  currTypedNewRelationType: string;
  currTypedUpdatedName: string;
  currTypedUpdatedRelationType: string;

  constructor(public dialogRef: MdDialogRef<DetailDialogComponent>, @Inject(MD_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    this.currTypedUpdatedName = this.data.name;
    this.currTypedUpdatedRelationType = this.data.relationshiptype;
  }

  close() {
    this.dialogRef.close();
  }

  updateScreenForCurrentTab(evt) {
    if (evt.tab.textLabel === "Add New Relation") {
      this.deleteButtonIsVisible = false;
      this.editOrAddConfirmationLabel = "Add relation and close"
    }
    if (evt.tab.textLabel === "Edit") {
      this.deleteButtonIsVisible = true;
      this.editOrAddConfirmationLabel = "Save changes and close"
    }
  }

  saveChangesAndClose() {
    var job = { action: "", node: "", newNode:{}, updatedNode: {}};
    if (this.editOrAddConfirmationLabel === "Add relation and close") {
      var newNode = { name: this.currTypedNewRelationName, relationshipttype: this.currTypedNewRelationType, relationships: []};
      job.action = "insert"
      job.node = this.data
      job.newNode = newNode;
    }
    if (this.editOrAddConfirmationLabel === "Save changes and close") {
      job.action = "edit"
      var updatedNode = { name: this.currTypedUpdatedName, relationshiptype: this.currTypedUpdatedRelationType, relationships: []};      
      job.node = this.data
      job.updatedNode = updatedNode;
    }
    this.dialogRef.close(job);
  }

  deleteMember() {
    var job = { action: "delete", member: this.data };
    this.dialogRef.close(job);
  }

}
