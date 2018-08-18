import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { HeadbarComponent } from './headbar/headbar.component';
import { QuestionDisplayComponent } from './question-display/question-display.component';
import { QuestionerComponent } from './questioner/questioner.component';
import { LandingComponent } from './landing/landing.component';
import { FileModalComponent } from './file-modal/file-modal.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgbModule.forRoot()
  ],
  declarations: [
    AppComponent,
    HeadbarComponent,
    QuestionDisplayComponent,
    QuestionerComponent,
    LandingComponent,
    FileModalComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
