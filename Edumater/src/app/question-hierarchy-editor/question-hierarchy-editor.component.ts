import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { QuestionNode } from '../common/QuestionNode';
import { Question } from '../common/Question';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-question-hierarchy-editor',
  templateUrl: './question-hierarchy-editor.component.html',
  styleUrls: ['./question-hierarchy-editor.component.css']
})
export class QuestionHierarchyEditorComponent implements OnInit {
  @Input() questionNode: QuestionNode;
  @Input() isChild: boolean = false;
  @Output() removeRequest = new EventEmitter<QuestionNode>();
  modalQuestionNode: QuestionNode;
  @ViewChild("questionModal") questionModal;
  @ViewChild("nameEditor") nameEditor: HTMLElement;
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  viewQuestions() {
    this.openQuestionModal(this.questionNode);
  }
  addQuestion() {
    if (!this.questionNode.Questions) this.questionNode.Questions = [];
    this.questionNode.Questions.push(new Question());
    this.openQuestionModal(this.questionNode);
  }
  expandChildren() {
    this.questionNode.Expanded = !this.questionNode.Expanded
  }
  addChild() {
    if (!this.questionNode.Children) this.questionNode.Children = [];
    let newNode = new QuestionNode();
    newNode.EditName = true;
    this.questionNode.Children.push(newNode);
    this.questionNode.Expanded = true;
  }
  nameEdit() {
    this.questionNode.EditName = !this.questionNode.EditName
  }

  openQuestionModal(node: QuestionNode) {
    this.modalQuestionNode = node;
    this.modalService.open(this.questionModal, { ariaLabelledBy: 'Question Editor', size: 'lg'  })
  }
  remove() {
    this.removeRequest.emit(this.questionNode);
  }
}
