export class Question {
    public QuestionText: string;
    public PrimaryAnswer: string;
    public AcceptableAnswers: string[];
    public IsCaseSensitive: boolean;
    public LastAsked: Date;
    public Created: Date;
    public AnsweredCorrectly: number;
    public AnsweredIncorrectly: number;
    public Priority: number;
}
