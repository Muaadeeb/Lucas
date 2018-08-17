import { Component, OnInit, Input } from '@angular/core';
import { Question } from '../common/Question';

@Component({
  selector: 'app-question-display',
  templateUrl: './question-display.component.html',
  styleUrls: ['./question-display.component.css']
})
export class QuestionDisplayComponent implements OnInit {
  @Input() question: Question;
  constructor() { }

  ngOnInit() {
  }

}
