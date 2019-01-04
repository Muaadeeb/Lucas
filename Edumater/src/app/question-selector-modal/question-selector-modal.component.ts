import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Question } from '../common/Question';
import * as _ from "underscore";

@Component({
  selector: 'app-question-selector-modal',
  templateUrl: './question-selector-modal.component.html',
  styleUrls: ['./question-selector-modal.component.css']
})
export class QuestionSelectorModalComponent implements OnInit {
  @Input() questions: Question[];
  filteredQuestions: Question[];
  selectedQuestion: Question;
  searchTerm: string; //DEAR RETURNING ME:  Questions don't seem to persist through the question service to the scoresheet editor you were working on.
  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.filteredQuestions = this.questions;
  }

  updateSearch() {
    this.filteredQuestions = _.filter(this.questions, (q => q.QuestionText.toLowerCase().indexOf(this.searchTerm.toLowerCase()) != -1));
  }

  select(question: Question) {
    this.activeModal.close(question);
  }
}
