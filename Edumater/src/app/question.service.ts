import { Injectable } from '@angular/core';
import { Observable, Subject, throwError, of } from 'rxjs';
import { map } from "rxjs/operators";
import * as _ from "underscore";
import { Utils } from './utils';
import { Question } from './Question';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private Questions: Question[];
  private CurrentQuestion: Question;
  private questionSource: IQuestionSource;
  public constructor(qs: IQuestionSource) {
    this.questionSource = qs;
  }
  public GetCurrentQuestion(): Question {
    return this.CurrentQuestion;
  }
  VerifyQuestions(questions: Question[]): boolean {
    if (questions === undefined || questions === null) {
      console.error("Questions Data null or undefined");
      return false;
    }

    if (questions.length === 0) {
      console.error("Questions Data of 0 length");
      return false;
    }

    if (questions.every((q) => q &&
      !isNaN(q.AnsweredCorrectly) && q.AnsweredCorrectly > 0 &&
      !isNaN(q.AnsweredCorrectly) && q.AnsweredIncorrectly > 0 &&
      q.Created !== undefined &&
      q.IsCaseSensitive !== undefined &&
      q.PrimaryAnswer !== undefined && q.PrimaryAnswer !== null && q.PrimaryAnswer !== "" &&
      !isNaN(q.Priority) &&
      q.QuestionText !== undefined && q.QuestionText !== null && q.QuestionText !== ""

    )) {
      console.error("A Question in the loaded dataset was missing required information. \n" +
        "Required Information Includes: AnsweredCorrectly, AnsweredIncorrectly, Created, IsCaseSensitive, PrimaryAnswer, Priority, and QuestionText")
      return false;
    }

    return true;
  }

  public OnQuestionAnswered: (question: Question, WasCorrect: boolean) => void;
  public OnSetNewQuestion: (question: Question) => void;


  private GetNextQuestion(): Observable<Question> {
    let toReturn: Subject<Question>;
    if (this.Questions === undefined || this.Questions === null || this.Questions.length === 0) {
      this.questionSource.RetrieveQuestions().subscribe((questions) => {
        if (!this.VerifyQuestions(questions)) {
          console.error("Questions failed to verify!");
          toReturn.error("Questions failed to verify!");
          return;
        }
        this.Questions = questions;
        toReturn.next(Utils.RandomElement(questions));

      },(error)=>toReturn.error(error));
    } else {
      toReturn.next(Utils.RandomElement(this.Questions));
    }
    return toReturn;
  }
  public AskNewQuestion():Observable<any> {
    return this.GetNextQuestion().pipe(map((question) => {
      this.CurrentQuestion = question;
      if (this.OnSetNewQuestion == null) {
        return throwError("No Action has been set for QuestionManager.OnSetNewQuestion")
      } else {
        this.OnSetNewQuestion(this.CurrentQuestion);
      }
    }));
  }
  public VerifyAnswer(Answer: string): Observable<boolean> {
    if (!this.CurrentQuestion) {
      return throwError("No question set for CurrentQuestion on verification.  Odds are you have no loaded questions.");
    }
    var correct: boolean;
    if (!!this.CurrentQuestion.IsCaseSensitive) { //bang bang you're boolean
      correct =
        Answer === this.CurrentQuestion.PrimaryAnswer
          || this.CurrentQuestion.AcceptableAnswers === undefined ? false :
          _.contains(this.CurrentQuestion.AcceptableAnswers, Answer);
    } else {
      correct =
        Answer.toLowerCase() === this.CurrentQuestion.PrimaryAnswer.toLowerCase()
          || this.CurrentQuestion.AcceptableAnswers === undefined ? false :
          _.contains(
            this.CurrentQuestion.AcceptableAnswers.map(
              function (value) { return value.toLowerCase() }),
            Answer.toLowerCase());
    }
    if (correct) { this.CurrentQuestion.AnsweredCorrectly++; } else { this.CurrentQuestion.AnsweredIncorrectly++; }
    of(correct);
  }
}
export interface IQuestionSource {
  RetrieveQuestions(): Observable<Question[]>;
}
