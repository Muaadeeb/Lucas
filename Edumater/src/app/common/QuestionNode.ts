//QuestionNode as in a node in a question heirarchy
import { Question } from "./Question"

export class QuestionNode{
  constructor(Name?: string, Questions?: Question[], Children?: QuestionNode[], Expanded?: boolean, QuestionsVisible?: boolean, EditName?: boolean) {
    this.Name = Name;
    this.Questions = Questions;
    this.Children = Children;
    this.Expanded = Expanded || false;
    this.QuestionsVisible = QuestionsVisible || false;
    this.EditName = EditName || false;
  }
  Name: string;
  Questions: Question[];
  Children: QuestionNode[];
  Expanded: boolean;
  QuestionsVisible: boolean;
  EditName: boolean;
}
