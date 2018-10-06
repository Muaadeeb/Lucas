//QuestionNode as in a node in a question heirarchy
import { Question } from "./Question"
import * as _ from "underscore";

export class QuestionNode{
  constructor(Name?: string, Questions?: Question[], Children?: QuestionNode[]) {
    this.Name = Name;
    this.Questions = Questions;
    this.Children = Children;
  }
  Name: string;
  Questions: Question[];
  Children: QuestionNode[];
  Expanded: boolean;
  EditName: boolean;
  Selected: boolean;
}



export function RecurseNodeChildren<T>(questionNode: QuestionNode, func: ((questionNode: QuestionNode) => void) | ((questionNode: QuestionNode, state: T) => T), state?: T) {
  if (state) {
    state = _.clone((func as (questionNode: QuestionNode, state: T) => T)(questionNode, state));
  } else {
    (func as (questionNode: QuestionNode) => void)(questionNode);
  }
  if(questionNode.Children) questionNode.Children.forEach((qn) => RecurseNodeChildren(qn, func, state));
}
