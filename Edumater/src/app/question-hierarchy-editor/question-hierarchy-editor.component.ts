import { Component, OnInit, Input, ViewChild, EventEmitter, Output, OnChanges } from '@angular/core';
import { QuestionNode } from '../common/QuestionNode';
import { Question } from '../common/Question';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from "underscore";
import { DragulaService } from 'ng2-dragula';
import { animation, trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-question-hierarchy-editor',
  templateUrl: './question-hierarchy-editor.component.html',
  styleUrls: ['./question-hierarchy-editor.component.css'],
  animations: [
    trigger("BadCharacter", [
      state("true", style({
        border: "2px solid red",
        backgroundColor:"#ffe7eb"
      })),
      state("false", style({
        
      })),
      transition("false => true", [
        animate("0.25s")
      ]),
      transition("true => false", [
        animate("0.25s")
      ])
    ])
  ]
})
export class QuestionHierarchyEditorComponent implements OnInit, OnChanges {
  @Input() questionNode: QuestionNode;
  @Input() selectMode: boolean = false;
  @Input() questionMode: boolean = false;
  @Input() fullySelectable: boolean = true;  //Whether selecting all child nodes of a node will select that node as well.

  @Input() isChild: boolean = false;
  @Output() removeRequest = new EventEmitter<QuestionNode>();
  @Output("selectChange") selectChangeEvent = new EventEmitter<boolean>();
  @Output() questionChange = new EventEmitter<void>();
  @ViewChild("questionModal") questionModal;
  @ViewChild("nameEditor") nameEditor: HTMLElement;
  modalQuestionNode: QuestionNode;
  selectIndeterminate: boolean;
  badCharacter: boolean = false;
  constructor(private modalService: NgbModal,
    private dragulaService: DragulaService) { }

  ngOnInit() {
    if (this.questionNode == null) {
      this.questionNode = new QuestionNode();
    }
  }
  ngOnChanges() {
    if (this.questionNode.Children === []) {
      this.questionNode.Children = null;
    }
  }


  viewQuestions() {
    this.openQuestionModal(this.questionNode);
  }
  addQuestion() {
    if (!this.questionNode.Questions) this.questionNode.Questions = [];
    const question = new Question();
    this.questionNode.Questions.push(question);
    this.openQuestionModal(this.questionNode);
    this.questionChange.emit();
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
    this.questionNode.EditName = !this.questionNode.EditName;
  }
  uneditName() {
    this.questionNode.EditName = false;
    this.questionNode.Name = this.questionNode.Name.replace(/[\/\.]/gi, "");
    this.badCharacter = false;
  }
  checkCharacter(event: KeyboardEvent) {
    if (event.key === "." || event.key === "/") {
      this.badCharacter = true;
    } else {
      if (this.badCharacter && !this.questionNode.Name.match(/[\/\.]/gi)) {
        this.badCharacter = false;
      }
    }
  }
  openQuestionModal(node: QuestionNode) {
    this.modalQuestionNode = node;
    this.modalService.open(this.questionModal, { ariaLabelledBy: 'Question Editor', size: 'lg' })
  }
  remove() {
    this.removeRequest.emit(this.questionNode);
  }
  removeChild(index: number) {
    this.questionNode.Children.splice(index, 1);
    this.questionChange.emit();
  }
  childSelectChange(checked: boolean) {
    if (this.fullySelectable == true) { //This compare actually necessary.   I have no idea, do not try to ask.
      this.questionNode.Selected = _.all(this.questionNode.Children, q => q.Selected);
      console.log(this.fullySelectable);
    }
    this.selectIndeterminate = !(this.fullySelectable && this.questionNode.Selected) && (checked || _.any(this.questionNode.Children, q => q.Selected));
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
