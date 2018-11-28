import { Injectable, ViewChild } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { QuestionService } from './question.service';
import { FileModalComponent } from './file-modal/file-modal.component';
import { ToQuestionNode } from './common/SavedQuestionNode';

@Injectable({
  providedIn: 'root'
})
export class DataLoadedGuard implements CanActivate {

  constructor(
    private qs: QuestionService,
    private router: Router) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.qs.QuestionsLoaded()) {
      return true;
    } else {
      this.router.navigate(["Questions", { continue: state.url }]);
      return false;
    }
  }
}

