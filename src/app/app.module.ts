import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { AppComponent } from './app.component';
import { HierarchyContainerComponent } from './hierarchy-container/hierarchy-container.component';
import { DetailDialogComponent } from './detail-dialog/detail-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import 'hammerjs';
import { ListContainerComponent } from './list-container/list-container.component';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  { path: '', component: HierarchyContainerComponent },
  { path: 'list-container', component: ListContainerComponent },
  { path: 'hierarchy-container', component: HierarchyContainerComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HierarchyContainerComponent,
    DetailDialogComponent,
    ListContainerComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
        RouterModule.forRoot(
      appRoutes /* ,
      { enableTracing: true } */ // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DetailDialogComponent]
})
export class AppModule { }
