import { plainToClass } from "class-transformer"
import * as _ from "underscore";


// yes, yes, I'm probably angering some ancient TypeScript beast putting this here, but it's so dang useful..
function RandomElement(array: any[]) {
    return array[_.random(array.length - 1)];

}













let qs = new QuestionsByFileSource();
let qm = new QuestionManager(qs);
let vm = new VerdictManager();

qm.OnSetNewQuestion = function (newQuestion: Question) {
    $("#QuestionText").text(newQuestion.QuestionText);
    $("#Answer").focus().val(""); //reset answer box and set focus on it (make it so that you can start typing right away)
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
    function OnQuestionLoadError(err: string) {
        $("#ErrorPlaceholder").html('<div class="alert alert-danger alert-dismissible fade show" role="alert" id="ErrorAlert"><h5 id = "ErrorText" class= "col-11"> </h5><button id = "ErrorDismiss" type = "button" class= "close" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>')
        $("#ErrorText").text(err);
    }
    $("#DismissVerdict").on("click", function () {
        $("#SubmitarizeIt").show();
        $("#Verdict").hide();
        qm.AskNewQuestion((err) => {
            if (err) {
                console.error("Error Thrown when asking next question (not first) Error Text:  " + err);
                OnQuestionLoadError(err);
            }
        });
    });
    $("#SubmitarizeIt").on("click", function () {
        qm.VerifyAnswer($("#Answer").val().toString() || "", (question, correct, err) => {
            if (err) {
                OnQuestionLoadError(err);
            } else {
                let v = $("#Verdict");
                if (correct) {
                    v.addClass("bg-success");
                    v.removeClass("bg-danger");
                } else {
                    v.addClass("bg-danger");
                    v.removeClass("bg-success");
                }
                vm.MakeVerdict(question.PrimaryAnswer, correct);
            }
        });
    })
    $("#Answer").on("keyup", function (event) {
        if (event.keyCode == 13 && $("#SubmitarizeIt").css("display") != "none") {
            $("#SubmitarizeIt").click();
        }
    });
    qm.AskNewQuestion((err) => {
        if (err) {
            console.error("Error Thrown when asking first (kickoff) question.  Error Text:  " + err);
            OnQuestionLoadError(err);
        }
    }); // Everything's set up, kick off with the first question
});