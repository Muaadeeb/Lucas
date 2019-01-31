import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { LandingComponent } from './landing/landing.component';
import { QuestionerComponent } from './questioner/questioner.component';
import { DataLoadedGuard } from './data-loaded.guard';
import { QuestionManagerComponent } from './question-manager/question-manager.component';
import { ScoresheetTunerComponent } from './scoresheet-tuner/scoresheet-tuner.component';
import { ScoresheetManagerComponent } from './scoresheet-manager/scoresheet-manager.component';
import { AboutComponent } from './about/about.component';
import { QuestionImporterComponent } from './question-importer/question-importer.component';

const routes: Routes = [
  { path: "", component: LandingComponent },
  //{ path: "Questioner", component: , canActivate: [DataLoadedGuard] },
  {
    path: "Questions",
    children: [
      { path: "", component: QuestionManagerComponent },
      { path: "Ask", component: QuestionerComponent, canActivate: [DataLoadedGuard] },
      {
        path: "Import", children: [
          { path: "", component: QuestionImporterComponent },
          {
            path: "File", children: [
              { path: "Text", redirectTo: "/" }
            ]
          }
        ]
      }
    ]
  },
  { path: "Scoresheets", component: ScoresheetManagerComponent },
  { path: "Scoresheets/Tune", component: ScoresheetTunerComponent },
  { path: "About", component: AboutComponent }
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
