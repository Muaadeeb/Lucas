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
  @Output("moveRequest") moveRequestEvent = new EventEmitter<MoveDirection>();
  modalQuestionNode: QuestionNode;
  @ViewChild("questionModal") questionModal;
  @ViewChild("nameEditor") nameEditor: HTMLElement;
  MoveDirection = MoveDirection;
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
    this.modalService.open(this.questionModal, { ariaLabelledBy: 'Question Editor', size: 'lg' })
  }
  remove() {
    this.removeRequest.emit(this.questionNode);
  }
  moveChild(index: number, direction: MoveDirection) {
    let arr = this.questionNode.Children;
    let old_index = index;
    let new_index = 0;
    switch (direction) { //Note that indexes increase as the actual object moves downwards, so increasing the index by one actually moves it down, not up
      case MoveDirection.Top:
        new_index = 0;
        break;
      case MoveDirection.Up:
        new_index = Math.max(index - 1, 0);
        break;
      case MoveDirection.Down:
        new_index = Math.min(index + 1, arr.length - 1);
        break;
      case MoveDirection.Bottom:
        new_index = arr.length - 1;
        break;
      default:
        throw "Invalid Move Direction";
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
  };

  //moveRequest v. moveChild:
  // although the buttons to move a child are on the child itself, the move must be performed on the parent
  // thus, the child's buttons will call "moveRequest", which bubbles the request up to the parent
  // the parent then calls "moveChild" to move the child within its children.
  moveRequest(direction: MoveDirection) {
    this.moveRequestEvent.emit(direction);
  }


}
enum MoveDirection {
  Top,
  Up,
  Down,
  Bottom
}
