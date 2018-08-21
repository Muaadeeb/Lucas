import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { HeadbarComponent } from './headbar/headbar.component';
import { QuestionDisplayComponent } from './question-display/question-display.component';
import { QuestionerComponent } from './questioner/questioner.component';
import { LandingComponent } from './landing/landing.component';
import { FileModalComponent } from './file-modal/file-modal.component';
import { QuestionSetEditorComponent } from './question-set-editor/question-set-editor.component';
import { QuestionHierarchyEditorComponent } from './question-hierarchy-editor/question-hierarchy-editor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    DragulaModule.forRoot(),
    BrowserAnimationsModule,
    MatCheckboxModule,
    AppRoutingModule,
    NgbModule.forRoot()
  ],
  declarations: [
    AppComponent,
    HeadbarComponent,
    QuestionDisplayComponent,
    QuestionerComponent,
    LandingComponent,
    FileModalComponent,
    QuestionSetEditorComponent,
    QuestionHierarchyEditorComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
