import { Component, OnInit, ViewChild, ElementRef,EventEmitter } from '@angular/core';
import { FileModalComponent } from '../file-modal/file-modal.component';
import { QuestionManager } from '../common/QuestionManager';
import { Question } from '../common/Question';
import { VerdictService } from '../verdict.service';
import { Verdict } from '../common/Verdict';

@Component({
  selector: 'app-questioner',
  templateUrl: './questioner.component.html',
  styleUrls: ['./questioner.component.css']
})
export class QuestionerComponent implements OnInit {
  @ViewChild("questionFileModal") questionFileModal: FileModalComponent;
  answer: HTMLInputElement;
  qm: QuestionManager;
  verdict: Verdict;
  dismissedVerdict: boolean = true;
  conceedFocusEventEmitter: EventEmitter<void> = new EventEmitter<void>();
  constructor(private verdictor: VerdictService) { }

  ngOnInit() {
    this.qm = new QuestionManager(this.questionFileModal);
  }
  openQuestions() {
    this.askNewQuestion();
  }
  askNewQuestion() {
    this.qm.AskNewQuestion().subscribe(() => { if (this.answer!=null) this.answer.focus() });
  }
  submitAnswer($answer, $dismiss) {
    if (this.dismissedVerdict) {
      this.verdict = this.verdictor.MakeVerdict(this.qm.CurrentQuestion.PrimaryAnswer, this.qm.VerifyAnswer($answer.value));
      this.askNewQuestion();
      this.dismissedVerdict = false;
      this.answer = $answer;
    } else {
      this.dismissedVerdict = true;
      this.answer.value = "";
    }
    
  }
}
