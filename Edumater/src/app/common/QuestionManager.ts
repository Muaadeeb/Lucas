import { Injectable } from '@angular/core';
import { Observable, Subject, throwError, of, Subscriber, TeardownLogic } from 'rxjs';
import { tap } from "rxjs/operators";
import * as _ from "underscore";
import { Utils } from './utils';
import { Question } from './Question';
import { SavedQuestionsData, VerifyQuestions } from './SavedQuestionsData';

export class QuestionManager {
  private Questions: Question[];
  public CurrentQuestion: Question;
  private questionSource: IQuestionSource;
  public constructor(qs: IQuestionSource) {
    this.questionSource = qs;
  }

  //public OnQuestionVerified: (question: Question, WasCorrect: boolean) => void;
  public OnUpdateQuestion: (question: Question) => void = () => { };


  private GetNextQuestion(): Observable<Question> {
    let toReturn: Subject<Question> = new Subject<Question>();
    if (this.Questions === undefined || this.Questions === null || this.Questions.length === 0) {
      this.questionSource.RetrieveQuestions().subscribe((savedQData) => {
        if (!VerifyQuestions(savedQData.Questions)) {
          toReturn.error("Questions failed to verify!");
          return;
        }
        this.Questions = savedQData.Questions;
        toReturn.next(Utils.RandomElement(savedQData.Questions));

      }, (error) => toReturn.error(error));
    } else {
      toReturn.next(Utils.RandomElement(this.Questions));
    }
    return toReturn;
  }
  public AskNewQuestion(): Observable<Question> {
    return this.GetNextQuestion().pipe(tap((question) => {
      this.CurrentQuestion = question;
    },(error)=>this.onError(error)));
  }
  onError: (error) => void = (error) => console.error(error);
  public VerifyAnswer(Answer: string): boolean {
    if (!this.CurrentQuestion) {
      throw new Error("No question set for CurrentQuestion on verification.  Odds are you have no loaded questions.");
    }
    var correct: boolean;
    if (!!this.CurrentQuestion.IsCaseSensitive) { //bang bang you're boolean
      correct =
        (Answer === this.CurrentQuestion.PrimaryAnswer)
          || (this.CurrentQuestion.AcceptableAnswers === undefined ? false :
          _.contains(this.CurrentQuestion.AcceptableAnswers, Answer));
    } else {
      correct =
        (Answer.toLowerCase() === this.CurrentQuestion.PrimaryAnswer.toLowerCase())
          || (this.CurrentQuestion.AcceptableAnswers === undefined ? false :
          _.contains(
            this.CurrentQuestion.AcceptableAnswers.map(
              function (value) { return value.toLowerCase() }),
            Answer.toLowerCase()));
    }
    if (correct) { this.CurrentQuestion.AnsweredCorrectly++; } else { this.CurrentQuestion.AnsweredIncorrectly++; }
    return correct;
  }
}
export interface IQuestionSource {
  RetrieveQuestions(): Observable<SavedQuestionsData>;
}
