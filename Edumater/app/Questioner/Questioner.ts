// yes, yes, I'm probably angering some ancient TypeScript beast putting this here, but it's so dang useful..
function RandomElement(array: any[]) {
    return array[_.random(array.length - 1)];

}

class Question {
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

class Verdict {
    Header: string;
    Elaboration: string;
    ConceedPrompt: string;
    //No images or anything just yet
    WasCorrect: boolean;
    CorrectAnswer: string;
}

class SavedQuestionsData {
    SaveName: string;
    Questions: Question[];
    CreateDate: Date;
    Notes: string;
}

class VerdictManager {
    private CorrectHeaders: string[] = ["You're Right!", "Congratulations!", "Wow, you is smart"];
    private CorrectElaborations: string[] = [
        "You're supreme Intelligence has produced yet another incredible feat of rightness man has never witnessed before.",
        "The mind you posses has defeated yet another insurmountable obstacle unfortunate enough to set itself in your path.",
        "The world trembles in awe at the intelligence you have portrayed through the magnificient feat you just accomplished",
        "wow."
    ]
    //No Correct Conceed prompts (for now, at least)
    private IncorrectHeaders: string[] = ["You is wrong", "You is dumb", "DAAAAANNG", "Seriously?  That one was easy!"]
    private IncorrectElaborations: string[] = [
        "That.... that was just dumb.  You messed up big time.",
        "Every man and woman on this planet has lost a considerable portion of thier intelligence as part of the idiot, stupid, preventable, and all-round idiotic mistake you just made.",
        "Seriously dude.  Get a brain."
    ]
    private IncorrectConceedPrompts: string[] = ["I'm Dumb", "I conceed my stupidity", "I'll be less dumb next time", "Sorry."]
    public OnVerdictChange: (newVerdict: Verdict) => void;
    public MakeVerdict(CorrectAnswer: string, WasCorrect: boolean): void {
        let v = new Verdict();
        if (WasCorrect) {
            v.Header = RandomElement(this.CorrectHeaders);
            v.Elaboration = RandomElement(this.CorrectElaborations)
        } else {
            v.Header = RandomElement(this.IncorrectHeaders);
            v.Elaboration = RandomElement(this.IncorrectElaborations);
            v.ConceedPrompt = RandomElement(this.IncorrectConceedPrompts);
        }
        v.WasCorrect = WasCorrect;
        v.CorrectAnswer = CorrectAnswer;
        this.OnVerdictChange == null ? console.warn("No Action set for VerdictManager.OnVerdictChange") : this.OnVerdictChange(v);
    }



}

class QuestionManager {
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

        if (questions.every((q) => {
            return !isNaN(q.AnsweredCorrectly) && q.AnsweredCorrectly > 0 &&
                !isNaN(q.AnsweredCorrectly) && q.AnsweredIncorrectly > 0 &&
                q.Created !== undefined &&
                q.IsCaseSensitive !== undefined &&
                q.PrimaryAnswer !== undefined && q.PrimaryAnswer !== null && q.PrimaryAnswer !== "" &&
                !isNaN(q.Priority) &&
                q.QuestionText !== undefined && q.QuestionText !== null && q.QuestionText !== ""

        })) {
            console.error("A Question in the loaded dataset was missing required information. \n" +
                "Required Information Includes: AnsweredCorrectly, AnsweredIncorrectly, Created, IsCaseSensitive, PrimaryAnswer, Priority, and QuestionText")
            return false;
        }

        return true;
    }

    public OnQuestionAnswered: (question: Question, WasCorrect: boolean) => void;
    public OnSetNewQuestion: (question: Question) => void;

    private GetNextQuestion(callback: (question: Question, err: string) => void): void {
        if (this.Questions === undefined || this.Questions === null || this.Questions.length === 0) {
            qs.RetrieveQuestions((questions, err) => {
                if (err) {
                    callback(null, err);
                } else {
                    if (!this.VerifyQuestions(questions)) {
                        console.error("Questions failed to verify!");
                        callback(null, "Questions failed to verify!");
                        return;
                    }
                    this.Questions = questions;
                    callback(RandomElement(questions), null);
                }
            });
        } else {
            callback(RandomElement(this.Questions),null);
        }
        //let q = new Question();
        //q.QuestionText = "How awesome is Lucas?";
        //q.PrimaryAnswer = "Amazing";
        //q.AcceptableAnswers = ["Very Awesome", "Very", "Infinitely"];
        //q.IsCaseSensitive = false;
        //q.AnsweredCorrectly = 100;
        //q.AnsweredIncorrectly = 0;
        //q.Created = new Date();
        //q.LastAsked = new Date();
        //q.Priority = 1000000;
        //return q;
    }
    public AskNewQuestion(callback: (err: string) => void) {
        this.GetNextQuestion((question, err) => {
            if (err) {
                callback(err);
            } else {
                this.OnSetNewQuestion == null ? console.warn("No Action has been set for QuestionManager.OnSetNewQuestion") : this.OnSetNewQuestion(this.CurrentQuestion);
                callback(null);
            }
        });

    }
    public VerifyAnswer(Answer: string) {
        if (!this.CurrentQuestion) {
            console.error("No question set for CurrentQuestion on verification.  Odds are you have no loaded questions.  Asking new question...");
            this.AskNewQuestion();
        }
        var correct: boolean;
        if (this.CurrentQuestion.IsCaseSensitive) {
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
        this.OnQuestionAnswered == null ? console.warn("No Action set for QuestionManager.OnQuestionAnswered") : this.OnQuestionAnswered(this.CurrentQuestion, correct);

    }
}

interface IQuestionSource {
    RetrieveQuestions(callback: (questions: Question[], err: string) => void): void;
}

class QuestionsByFileSource implements IQuestionSource {
    public RetrieveQuestions(callback: (questions: Question[], err: string) => void): void {
        $("#OpenQuestionFileModal").modal("show");

        $("#OpenQuestionClose").on("click", function () {
            callback(null, "Question Modal was closed before questions could be loaded.");
        })
        $("#OpenQuestionSubmit").on("click", function () {
            if ($("#OpenQuestionFile").prop("files")[0]) {
                let fr = new FileReader();
                fr.onload = () => {
                    let data: SavedQuestionsData;

                    try {
                        data = JSON.parse(fr.result);
                    } catch (e) {
                        $("#OpenQuestionError").text(e);
                        return;
                    }
                    try {
                        if (data.SaveName === null || data.Questions === null || data.Questions.length === 0) {
                            $("#OpenQuestionError").text("Question File was unnamed or contained no questions (odds are it is a corrupted file)");
                        } else {
                            $("#OpenQuestionFileQCount").text(data.Questions.length + " Qs");
                            $("#OpenQuestionFileName").text(data.SaveName || "<No Save Name>");
                            $("#OpenQuestionFileCreated").text(data.CreateDate === undefined ? "<No Create Date>"
                                : (data.CreateDate.toLocaleDateString() + " at " + data.CreateDate.toLocaleTimeString()))
                            $("#OpenQuestionFileNotes").text(data.Notes || "<No Notes>");
                            $("#OpenQuestionFileInfo").removeClass("hidden");

                            $("#OpenQuestionFileInfo").removeClass("bg-danger");
                            if ($("#OpenQuestionAccept").hasClass("disabled")) {
                                $("#OpenQuestionAccept").removeClass("disabled")
                                    .on("click", function () {
                                        $("#OpenQuestionFileModal").modal("hide");
                                        callback(data.Questions, null);
                                    })
                            }
                        }
                    } catch (e) {
                        $("#OpenQuestionError").text("It appears your data's missing some pieces.");
                    }

                }
                fr.readAsText($("#OpenQuestionFile").prop("files")[0]);
            } else {
                $("#OpenQuestionError").text("No File selected (or perhaps your browser isn't supported");
            }
        })
        return null;
    }
}

let qs = new QuestionsByFileSource();
let qm = new QuestionManager(qs);
let vm = new VerdictManager();

qm.OnSetNewQuestion = function (newQuestion: Question) {
    $("#QuestionText").text(newQuestion.QuestionText);
    $("#Answer").focus().val(""); //reset answer box and set focus on it (make it so that you can start typing right away)
}

qm.OnQuestionAnswered = function (question: Question, WasCorrect: boolean) {
    let v = $("#Verdict");
    if (WasCorrect) {
        v.addClass("bg-success");
        v.removeClass("bg-danger");
    } else {
        v.addClass("bg-danger");
        v.removeClass("bg-success");
    }
    vm.MakeVerdict(question.PrimaryAnswer, WasCorrect);
}

vm.OnVerdictChange = function (verdict: Verdict) {
    let changeText = (err: string) => {
        if (err) {
            $("#VerdictText").text("DUDE, THERE WAS AN ERROR.  NOT YOU THIS TIME.");
            $("#VerdictElaboration").text("Error text:  " + err);
        } else {
            $("#VerdictText").text(verdict.Header);
            $("#VerdictElaboration").text(verdict.Elaboration);
            $("#CorrectAnswerText").text(verdict.CorrectAnswer);
        }
        $("#Verdict").show();
    }
    if (verdict.WasCorrect) {
        $("#IncorrectAnswerBox").hide();
        qm.AskNewQuestion(changeText);
    } else {
        $("#DismissVerdict").text(verdict.ConceedPrompt);
        $("#IncorrectAnswerBox").show();
        $("#SubmitarizeIt").hide();
        changeText(null);
    }
}

$(document).ready(function () {
    
    $("#DismissVerdict").on("click", function () {
        $("#SubmitarizeIt").show();
        $("#Verdict").hide();
        qm.AskNewQuestion((err) => {
            console.error("Error Thrown when asking next question (not first) Error Text:  " + err);
            OnQuestionLoadError(err);
        });
    });
    $("#SubmitarizeIt").on("click", function () {
        qm.VerifyAnswer($("#Answer").val().toString());
    })
    $("#Answer").on("keyup", function (event) {
        if (event.keyCode == 13 && $("#SubmitarizeIt").css("display") != "none") {
            $("#SubmitarizeIt").click();
        }
    });
    qm.AskNewQuestion((err) => {
        console.error("Error Thrown when asking first (kickoff) question.  Error Text:  " + err);
        OnQuestionLoadError(err);
    }); // Everything's set up, kick off with the first question
});