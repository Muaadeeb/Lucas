import { Injectable } from '@angular/core';
import { Observable, Subject, throwError, of, Subscriber, TeardownLogic } from 'rxjs';
import { tap } from "rxjs/operators";
import * as _ from "underscore";
import { Utils } from './common/Utils';
import { Question } from './common/Question';
import { SavedQuestionsData, VerifyQuestions } from './common/SavedQuestionsData';
import { QuestionNode } from './common/QuestionNode';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  public RootNode: QuestionNode;
  private ActiveQuestions: Question[];
  private AllQuestions: Question[];
  public CurrentQuestion: Question;
  public constructor() {
    this.RootNode = new QuestionNode("New Project", [], []);
    this.ActiveQuestions = [];
    this.AllQuestions = [];
  }

  public AddNode(questionNode: QuestionNode) {
    this.RootNode.Children.push(questionNode);
    this.UpdateQuestionSelection();
    if (this.CurrentQuestion == null) {
      this.AskNewQuestion();
    }
  }

  public QuestionsLoaded(): boolean {
    return this.ActiveQuestions.length > 0;
  }

  public UpdateQuestionSelection() {
    let questionArrays = new Array<Question[]>();
    let selected = [];
    //No, I'm not planning on kidnapping anyone
    let grabChildren = (questionNode: QuestionNode) => {
      if (questionNode.Questions != null) {
        questionArrays.push(questionNode.Questions);
        selected.push(questionNode.Selected);
      }
      if (questionNode.Children)
        questionNode.Children.forEach(c => grabChildren(c));
    }
    grabChildren(this.RootNode);
    this.AllQuestions = _.flatten(questionArrays);
    this.ActiveQuestions = _.flatten(_.filter(questionArrays, (qa, index) => selected[index]));
  }


  public OnUpdateQuestion: (question: Question) => void = () => { };

  private GetNextQuestion(): Observable<Question> {
    if (!this.QuestionsLoaded()) {
      return throwError("There are no questions loaded!");
    }
    return of(Utils.RandomElement(this.ActiveQuestions));
  }
  public AskNewQuestion(): Observable<Question> {
    return this.GetNextQuestion().pipe(tap((question) => {
      this.CurrentQuestion = question;
      console.log(question);
    }, (error) => this.onError(error)));
  }
  onError: (error) => void = (error) => { throw error };
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
