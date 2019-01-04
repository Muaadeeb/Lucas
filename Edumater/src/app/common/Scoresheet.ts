export class Scoresheet {
  public Correct: ScoreProcessor = new ScoreProcessor(5);  //Preconfigure some default, pretty bogus values.
  public Incorrect: ScoreProcessor = new ScoreProcessor(5);
  public Timespan: ScoreProcessor = new ScoreProcessor(0.001, 2);
  public Priority: ScoreProcessor = new ScoreProcessor(100);
}

export class ScoreProcessor {
  constructor(Multiplier?: number, Exponent?: number) {
    this.Multiplier = Multiplier || this.Multiplier;
    this.Exponent = Exponent || this.Exponent;
  }
  public Multiplier: number = 1;
  public Exponent: number = 1;
}
