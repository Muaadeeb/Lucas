import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Question } from '../common/Question';

@Component({
  selector: 'app-question-display',
  templateUrl: './question-display.component.html',
  styleUrls: ['./question-display.component.css']
})
export class QuestionDisplayComponent implements OnInit {
  @Input() question: Question;
  @Input() editable: boolean = false;
  @Input() removable: boolean = false;

  @Output("removeRequest") removeRequest = new EventEmitter<Question>();
  constructor() { }

  ngOnInit() {
  }

  trackByFn(index: number, item: any) {
    return index;
  }
  remove() {
    this.removeRequest.emit(this.question);
  }
}
