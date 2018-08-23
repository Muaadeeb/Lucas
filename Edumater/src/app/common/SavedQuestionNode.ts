import { Question } from "./Question";
import { QuestionNode } from "./QuestionNode";
import * as _ from "underscore";
import { List } from "underscore";

export class SavedQuestionNode{
  constructor(Name: string, Questions: Question[], Children: SavedQuestionNode[]) {
    this.Name = Name;
    this.Questions = Questions;
    this.Children = Children;
  }
  Name: string;
  Questions: Question[];
  Children: SavedQuestionNode[];
}
export function ToSavedQuestionNode(questionNode: QuestionNode): SavedQuestionNode {
  return new SavedQuestionNode(questionNode.Name, questionNode.Questions, _.map(questionNode.Children, (q) => ToSavedQuestionNode(q)));
}
export function ToQuestionNode(savedQuestionNode: SavedQuestionNode) {
  return new QuestionNode(savedQuestionNode.Name, savedQuestionNode.Questions, _.map(savedQuestionNode.Children, (q) => ToQuestionNode(q)));
}
