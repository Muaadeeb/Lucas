//QuestionNode as in a node in a question heirarchy
import { Question } from "./Question"

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
