import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../question.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuestionSelectorModalComponent } from '../question-selector-modal/question-selector-modal.component';
import { Question } from '../common/Question';
import { Scoresheet } from '../common/Scoresheet';
import { ScoreService, ScoreResult } from '../score.service';
import * as _ from "underscore";

@Component({
  selector: 'app-scoresheet-tuner',
  templateUrl: './scoresheet-tuner.component.html',
  styleUrls: ['./scoresheet-tuner.component.css']
})
export class ScoresheetTunerComponent implements OnInit {
  private scoresheet: Scoresheet;
  private testQuestion: Question;
  private scoreResult: [string, string][];
  private score: number;
  private scoresheetChanged: boolean;
  //private underscore: UnderscoreStatus = _;
  constructor(private modalService: NgbModal,
    private questionService: QuestionService,
    private scoreService: ScoreService) { }

  ngOnInit() {
    this.scoresheet = this.scoreService.CurrentScoresheet;
  }

  select() {
    let modalRef = this.modalService.open(QuestionSelectorModalComponent);
    modalRef.componentInstance.questions = this.questionService.ActiveQuestions;
    modalRef.result.then((question) => {
      this.testQuestion = question;
      this.updateTester();
    });
  }

  onScoresheetChange() {
    this.scoresheetChanged = true;
    if (this.testQuestion) {
      this.updateTester();
    }
  }

  updateTester() {
    this.score = this.scoreService.ScoreQuestion(this.testQuestion, this.scoresheet, (scoreResult) => this.scoreResult = _.pairs(scoreResult));
  }

  applyScoresheet() {
    if (this.scoresheetChanged) {
      this.scoreService.CurrentScoresheet = _.clone(this.scoresheet);
      this.scoresheetChanged = false;
    }
  }
}
