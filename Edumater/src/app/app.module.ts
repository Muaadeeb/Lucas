import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core"
import { faQuestion, faArrowRight, faArrowLeft, faFlask, faGraduationCap, faUpload, faDownload, faPenSquare, faTools, faFileImport } from "@fortawesome/free-solid-svg-icons";

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
import { QuestionManagerComponent } from './question-manager/question-manager.component';
import { ScoresheetEditorComponent } from './scoresheet-editor/scoresheet-editor.component';
import { ScoresheetTunerComponent } from './scoresheet-tuner/scoresheet-tuner.component';
import { QuestionSelectorModalComponent } from './question-selector-modal/question-selector-modal.component';
import { ScoreprocessorEditorComponent } from './scoreprocessor-editor/scoreprocessor-editor.component';
import { ScoresheetManagerComponent } from './scoresheet-manager/scoresheet-manager.component';
import { AboutComponent } from './about/about.component';
import { QuestionImporterComponent } from './question-importer/question-importer.component';
import { TextImporterComponent } from './question-importer/text-importer/text-importer.component';

library.add(
  faQuestion, faArrowRight, faArrowLeft, faFlask, faGraduationCap, faUpload, faDownload, faPenSquare, faTools, faFileImport
)

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    DragulaModule.forRoot(),
    BrowserAnimationsModule,
    MatCheckboxModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    FontAwesomeModule
  ],
  declarations: [
    AppComponent,
    HeadbarComponent,
    QuestionDisplayComponent,
    QuestionerComponent,
    LandingComponent,
    FileModalComponent,
    QuestionSetEditorComponent,
    QuestionHierarchyEditorComponent,
    QuestionManagerComponent,
    ScoresheetEditorComponent,
    ScoresheetTunerComponent,
    QuestionSelectorModalComponent,
    ScoreprocessorEditorComponent,
    ScoresheetManagerComponent,
    AboutComponent,
    QuestionImporterComponent,
    TextImporterComponent
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [QuestionSelectorModalComponent,
    TextImporterComponent]
})
export class AppModule { }
