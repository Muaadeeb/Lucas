import { Component, OnInit, Input, ViewChild, EventEmitter, Output, OnChanges } from '@angular/core';
import { QuestionNode } from '../common/QuestionNode';
import { Question } from '../common/Question';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from "underscore";
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-question-hierarchy-editor',
  templateUrl: './question-hierarchy-editor.component.html',
  styleUrls: ['./question-hierarchy-editor.component.css']
})
export class QuestionHierarchyEditorComponent implements OnInit, OnChanges {
  @Input() questionNode: QuestionNode;
  @Input() isChild: boolean = false;
  @Input() selectMode: boolean = false;
  @Input() fullySelectable: boolean = true;  //Whether selecting all child nodes of a node will select that node as well.
  @Output() removeRequest = new EventEmitter<QuestionNode>();
  @Output("selectChange") selectChangeEvent = new EventEmitter<boolean>();
  @ViewChild("questionModal") questionModal;
  @ViewChild("nameEditor") nameEditor: HTMLElement;
  modalQuestionNode: QuestionNode;
  selectIndeterminate: boolean;
  constructor(private modalService: NgbModal,
    private dragulaService: DragulaService) { }

  ngOnInit() {

  }
  ngOnChanges() {
    if (this.questionNode.Children ===[]) {
      this.questionNode.Children = null;
    }
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
  childSelectChange(checked: boolean) {
    if (this.fullySelectable==true) { //This is actually necessary.   I have no idea, do not try to ask.
      this.questionNode.Selected = _.all(this.questionNode.Children, q => q.Selected);
      console.log(this.fullySelectable);
    }
    this.selectIndeterminate = !(this.fullySelectable&&this.questionNode.Selected)&&(checked || _.any(this.questionNode.Children, q => q.Selected));
    this.selectChangeEvent.emit(checked);
  }
  selectChange(value: boolean) {
    this.setNodeSelected(this.questionNode, value);
    if (this.questionNode.Children) this.questionNode.Expanded = false;
    this.selectChangeEvent.emit(value);
  }
  setNodeSelected(node: QuestionNode, value: boolean) {
    node.Selected = value;
    if (node.Children) {
      for (var i = 0; i < node.Children.length; i++) {
        this.setNodeSelected(node.Children[i], value);
      }
    }
  }
}
