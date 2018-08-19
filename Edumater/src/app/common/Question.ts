export class Question {
  constructor(QuestionText?: string, PrimaryAnswer?: string, AcceptableAnswers?: string[], IsCaseSensitive? : boolean, Created?: Date, LastAsked?: Date, AnsweredCorrectly?: number, AnsweredIncorrectly?: number,  Priority?: number) {
    this.QuestionText = QuestionText || "";
    this.PrimaryAnswer = PrimaryAnswer || "";
    this.AcceptableAnswers = AcceptableAnswers || [];
    this.IsCaseSensitive = IsCaseSensitive || false;
    this.LastAsked = LastAsked || null;
    this.Created = Created || new Date();
    this.AnsweredCorrectly = AnsweredCorrectly || 0;
    this.AnsweredIncorrectly = AnsweredIncorrectly || 0;
    this.Priority = Priority || 0;
  }
    public QuestionText: string;
    public PrimaryAnswer: string;
    public AcceptableAnswers: string[];
    public IsCaseSensitive: boolean;
    public Created: Date;
    public LastAsked: Date;
    public AnsweredCorrectly: number;
    public AnsweredIncorrectly: number;
  public Priority: number;


}
