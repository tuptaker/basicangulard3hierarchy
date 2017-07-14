import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { AppComponent } from './app.component';
import { HierarchyContainerComponent } from './hierarchy-container/hierarchy-container.component';
import { DetailDialogComponent } from './detail-dialog/detail-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent,
    HierarchyContainerComponent,
    DetailDialogComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DetailDialogComponent]
})
export class AppModule { }
