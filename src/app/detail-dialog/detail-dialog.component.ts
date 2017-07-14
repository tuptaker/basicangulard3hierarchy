import { Component, Inject, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-detail-dialog',
  templateUrl: './detail-dialog.component.html',
  styleUrls: ['./detail-dialog.component.css']
})

export class DetailDialogComponent {
  editOrAddConfirmationLabel = "Save changes and close";
  deleteButtonIsVisible = true;

  constructor(public dialogRef: MdDialogRef<DetailDialogComponent>, @Inject(MD_DIALOG_DATA) public data: any) { }


  ngOnInit() {
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
    var job = { action: "", member: "", newrelation:{}};
    if (this.editOrAddConfirmationLabel === "Add relation and close") {
      var newMember = { name: "", relationshipttypes: "", relationships: []};
      job.action = "insert"
      job.member = this.data
      job.newrelation = newMember;
    }
    if (this.editOrAddConfirmationLabel === "Save changes and close") {
      job.action = "edit"
      // TODO: get new values from form and figure out how to indicate that node needs to be updated
      job.member = this.data
      job.newrelation = newMember;
    }
    this.dialogRef.close(job);
  }

  deleteMember() {
    var job = { action: "delete", member: this.data };
    this.dialogRef.close(job);
  }

}
