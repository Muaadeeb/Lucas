import { Injectable } from '@angular/core';
import { Scoresheet, ScoreProcessor } from './common/Scoresheet';
import { Question } from './common/Question';
import * as _ from "underscore";

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  public CurrentScoresheet: Scoresheet;
  public CurrentScoresheetName: string;
  public DefaultScoresheet: Scoresheet = new Scoresheet();
  constructor() {
    this.CurrentScoresheet = this.DefaultScoresheet;
    this.CurrentScoresheetName = "Default";
  }

  public ScoreQuestion(question: Question, scoresheet: Scoresheet = this.CurrentScoresheet, breakDownCallback?: (scoreResult: ScoreResult)=>void) {
    let unprocessed = {
      "Correct Answers": { value: question.AnsweredCorrectly, scoreProcessor: scoresheet.Correct },
      "Incorrect Answers": { value: question.AnsweredIncorrectly, scoreProcessor: scoresheet.Incorrect },
      "Minutes since last answered": { value: question.LastAsked == null ? 0 : (new Date().getMinutes() - question.LastAsked.getMinutes()), scoreProcessor: scoresheet.Timespan },
      "Priority": { value: question.Priority, scoreProcessor: scoresheet.Priority }
    };

    let result: ScoreResult = _.mapObject(unprocessed,
      (datum, key) => {
        return { score: this.ProcessDatapoint(datum.value, datum.scoreProcessor), input: datum.value };
      });

    if (breakDownCallback) breakDownCallback(result);
    return _.reduce(_.values(result), (prev: number, datumResult) => { return prev + datumResult.score },0);
  }

  private ProcessDatapoint(datum: number, processor: ScoreProcessor) {
    return processor.Multiplier * datum ^ processor.Exponent;
  }
}

export class ScoreResult {
  [datum: string]: {
    score: number,
    input: number
  }
}
