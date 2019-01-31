import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Question } from '../common/Question';

@Component({
  selector: 'app-question-set-editor',
  templateUrl: './question-set-editor.component.html',
  styleUrls: ['./question-set-editor.component.css']
})
export class QuestionSetEditorComponent implements OnInit {
  @Input() questions: Question[];

  @Output() questionChange = new EventEmitter<Question>();
  
  constructor() { }

  ngOnInit() {
  }
  addQuestion() {
    let question = new Question();
    this.questions.push(question);
    this.questionChange.emit(question);
  }
  removeQuestion(i: number) {
    this.questions.splice(i, 1);
    this.questionChange.emit();
  }
}
