import { Component, OnInit, Input } from '@angular/core';
import { Question } from '../common/Question';

@Component({
  selector: 'app-question-set-editor',
  templateUrl: './question-set-editor.component.html',
  styleUrls: ['./question-set-editor.component.css']
})
export class QuestionSetEditorComponent implements OnInit {
  @Input() questions: Question[];
  constructor() { }

  ngOnInit() {
  }
  addQuestion() {
    this.questions.push(new Question());
  }
}
