import { Component, Inject, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-detail-dialog',
  templateUrl: './detail-dialog.component.html',
  styleUrls: ['./detail-dialog.component.css']
})

export class DetailDialogComponent {

  constructor(public dialogRef: MdDialogRef<DetailDialogComponent>, @Inject(MD_DIALOG_DATA) public data: any) { }


  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

}
