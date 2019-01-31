import { Component, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { FileModalComponent } from '../file-modal/file-modal.component';
import { Question } from '../common/Question';
import { VerdictService } from '../verdict.service';
import { Verdict } from '../common/Verdict';
import { QuestionService } from '../question.service';
import { ToQuestionNode } from '../common/SavedQuestionNode';

@Component({
  selector: 'app-questioner',
  templateUrl: './questioner.component.html',
  styleUrls: ['./questioner.component.css']
})
export class QuestionerComponent implements OnInit {
  answer: HTMLInputElement;
  verdict: Verdict;
  dismissedVerdict: boolean = true;
  conceedFocusEventEmitter: EventEmitter<void> = new EventEmitter<void>();
  randomColor: string;
  constructor(private verdictor: VerdictService,
    private qs: QuestionService) { }

  ngOnInit() {
    this.askNewQuestion();
  }

  askNewQuestion() {
    this.qs.AskNewQuestion().subscribe(() => { if (this.answer != null) this.answer.focus() });
    this.randomColor = this.generateRandomQuestion();
  }
    generateRandomQuestion(): string {
      return `hsl(${Math.floor(Math.random()*360)},70%,55%)`;
    }
  submitAnswer($answer, $dismiss) {
    if (this.dismissedVerdict) {
      this.verdict = this.verdictor.MakeVerdict(this.qs.CurrentQuestion.PrimaryAnswer, this.qs.VerifyAnswer($answer.value));
      this.askNewQuestion();
      this.dismissedVerdict = false;
      this.answer = $answer;
    } else {
      this.dismissedVerdict = true;
    }
    this.answer.value = "";
  }

  saveQuestions() {

  }
}
