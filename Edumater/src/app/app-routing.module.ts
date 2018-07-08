import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { QuestionerComponent } from './questioner/questioner.component';

const routes: Routes = [
  { path: "", component: LandingComponent },
  { path: "Questioner", component: QuestionerComponent }
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
