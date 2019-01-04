import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { QuestionerComponent } from './questioner/questioner.component';
import { DataLoadedGuard } from './data-loaded.guard';
import { QuestionManagerComponent } from './question-manager/question-manager.component';
import { ScoresheetTunerComponent } from './scoresheet-tuner/scoresheet-tuner.component';
import { ScoresheetManagerComponent } from './scoresheet-manager/scoresheet-manager.component';

const routes: Routes = [
  { path: "", component: LandingComponent },
  //{ path: "Questioner", component: , canActivate: [DataLoadedGuard] },
  { path: "Questions", component: QuestionManagerComponent },
  { path: "Questions/Ask", component: QuestionerComponent, canActivate: [DataLoadedGuard] },
  { path: "Scoresheets", component: ScoresheetManagerComponent },
  { path: "Scoresheets/Tune", component: ScoresheetTunerComponent }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
