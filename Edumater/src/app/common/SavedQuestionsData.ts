import { Question } from "./Question";
import { SavedQuestionNode } from "./SavedQuestionNode";

export class SavedQuestionsData {
  constructor(Data?: SavedQuestionNode, CreateDate?: Date, Notes?: string) {
    this.Data = Data;
    this.CreateDate = CreateDate || new Date();
    this.Notes = Notes;
  }
  Data: SavedQuestionNode;
  CreateDate: Date;
  Notes: string;
}

export function VerifyQuestions(questions:Question[],onError: (error: string) => void = (error) => console.error(error)): boolean {
  if (questions === undefined || questions === null) {
    onError("Questions Data null or undefined");
    return false;
  }

  if (!(questions instanceof Array)||questions.length === 0) {
    onError("Questions Data of 0 length");
    return false;
  }

  if (!questions.every((q) => q &&
    !isNaN(q.AnsweredCorrectly) && q.AnsweredCorrectly >= 0 &&
    !isNaN(q.AnsweredCorrectly) && q.AnsweredIncorrectly >= 0 &&
    q.Created !== undefined &&
    q.IsCaseSensitive !== undefined &&
    q.PrimaryAnswer !== undefined && q.PrimaryAnswer !== null && q.PrimaryAnswer !== "" &&
    !isNaN(q.Priority) &&
    q.QuestionText !== undefined && q.QuestionText !== null && q.QuestionText !== ""

  )) {
    onError("A Question in the loaded dataset was missing required information. \n" +
      "Required Information Includes: AnsweredCorrectly, AnsweredIncorrectly, Created, IsCaseSensitive, PrimaryAnswer, Priority, and QuestionText")
    return false;
  }

  return true;
}
