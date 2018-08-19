import { Component, OnInit, Input } from '@angular/core';
import { QuestionNode } from '../common/QuestionNode';
import { Question } from '../common/Question';

@Component({
  selector: 'app-question-hierarchy-editor',
  templateUrl: './question-hierarchy-editor.component.html',
  styleUrls: ['./question-hierarchy-editor.component.css']
})
export class QuestionHierarchyEditorComponent implements OnInit {
  @Input() questionNode: QuestionNode;
  constructor() { }

  ngOnInit() {
  }

  expandQuestions(childNode: QuestionNode) {
    childNode.Expanded = true;
    childNode.QuestionsVisible = !childNode.QuestionsVisible;
  }
  expandChildren(childNode: QuestionNode) {
    childNode.Expanded = !childNode.Expanded
  }
  addQuestion(childNode: QuestionNode) {
    if (!childNode.Questions) childNode.Questions = [];
    childNode.Questions.push(new Question());
    childNode.Expanded = true;
    childNode.QuestionsVisible = true;
    childNode.EditName = true;
  }
  addChild(childNode: QuestionNode, nameEditor?:HTMLInputElement) {
    if (!childNode.Children) childNode.Children = [];
    childNode.Children.push(new QuestionNode());
    childNode.Expanded = true;
    if (nameEditor) nameEditor.focus();
  }
  toggleNameEdit(childNode: QuestionNode) {
    childNode.EditName = !childNode.EditName
  }
}
