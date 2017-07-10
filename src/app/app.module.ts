import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HierarchyContainerComponent } from './hierarchy-container/hierarchy-container.component';

@NgModule({
  declarations: [
    AppComponent,
    HierarchyContainerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
