import { Injectable } from '@angular/core';
import { Observable, Subject, throwError, of, Subscriber, TeardownLogic } from 'rxjs';
import { tap } from "rxjs/operators";
import * as _ from "underscore";
import { Utils } from './common/Utils';
import { Question } from './common/Question';
import { SavedQuestionsData, VerifyQuestions } from './common/SavedQuestionsData';
import { QuestionNode } from './common/QuestionNode';
import { ScoreService } from './score.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private _RootNode: QuestionNode;
    public get RootNode(): QuestionNode {
        return this._RootNode;
    }
    public set RootNode(value: QuestionNode) {
        this._RootNode = value;
    }
  public ActiveQuestions: Question[];
  private ActiveQuestionScores: number[];
  public AllQuestions: Question[];
  public CurrentQuestion: Question;
  public constructor(private scoreService: ScoreService) {
    const stored = JSON.parse(sessionStorage.getItem("RootNode"));
    this.RootNode = stored || new QuestionNode("New Project", [], []);
    this.ActiveQuestions = [];
    this.AllQuestions = [];
    this.UpdateQuestionSelection();
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
    this.ActiveQuestionScores = [];
    sessionStorage.setItem("RootNode", JSON.stringify(this.RootNode));
  }

  public OnUpdateQuestion: (question: Question) => void = () => { };

  private ScoreQuestion(question: Question): number {
    return this.scoreService.ScoreQuestion(question);
  }

  private ScoreActiveQuestions() {
    this.ActiveQuestions.forEach((question, index) => {
      this.ActiveQuestionScores[index] = this.ScoreQuestion(question);
    });
  }

  private GetNextQuestion(): Observable<Question> {
    if (!this.QuestionsLoaded()) {
      return throwError("There are no questions loaded!");
    }
    return new Observable((sub) => {
      if (this.ActiveQuestionScores == null || this.ActiveQuestionScores.length != this.ActiveQuestions.length) {
        this.ScoreActiveQuestions();
      }
      sub.next(this.ActiveQuestions[
        _.indexOf(this.ActiveQuestionScores, _.max(this.ActiveQuestionScores))
      ]);
    })
  }
  public AskNewQuestion(): Observable<Question> {
    return this.GetNextQuestion().pipe(tap((question) => {
      this.CurrentQuestion = question;
      this.CurrentQuestion.LastAsked = new Date();
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

    let currentIndex = this.ActiveQuestions.findIndex((value, index, obj) => {
      return value == this.CurrentQuestion;
    });
    this.ActiveQuestionScores[currentIndex] = this.ScoreQuestion(this.CurrentQuestion); //Rescore the current question with new answer history.
    return correct;
  }
}
