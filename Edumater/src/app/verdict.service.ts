import { Injectable } from '@angular/core';
import { Utils } from "./utils";
import { Verdict } from './Verdict';

@Injectable({
  providedIn: 'root'
})
export class VerdictManager {
  private CorrectHeaders: string[] = ["You're Right!", "Congratulations!", "Wow, you is smart"];
  private CorrectElaborations: string[] = [
    "You're supreme Intelligence has produced yet another incredible feat of rightness man has never witnessed before.",
    "The mind you possess has defeated yet another insurmountable obstacle unfortunate enough to set itself in your path.",
    "The world trembles in awe at the intelligence you have portrayed through this magnificient feat you just accomplished",
    "wow."
  ];
  private CorrectConceedPrompts: string[] = ["Why thank you", "Yes, yes, move on", "Well, duh", "Uh-huh.", ":)"];
  private IncorrectHeaders: string[] = ["You is wrong", "You is dumb", "DAAAAANNG", "Seriously?  That one was easy!"];
  private IncorrectElaborations: string[] = [
    "That.... that was just dumb.  You messed up big time.",
    "Every man and woman on this planet has lost a considerable portion of thier intelligence as part of the idiot, stupid, preventable, and all-round idiotic mistake you just made.",
    "Seriously dude.  Get a brain."
  ];
  private IncorrectConceedPrompts: string[] = ["I'm Dumb", "I conceed my stupidity", "I'll be less dumb next time", "Sorry.", "wubba lubba dub dub?"];
  public OnVerdictChange: (newVerdict: Verdict) => void;
  public MakeVerdict(CorrectAnswer: string, WasCorrect: boolean): void {
    let v = new Verdict();
    if (WasCorrect) {
      v.Header = Utils.RandomElement(this.CorrectHeaders);
      v.Elaboration = Utils.RandomElement(this.CorrectElaborations)
      v.ConceedPrompt = Utils.RandomElement(this.CorrectConceedPrompts);
    } else {
      v.Header = Utils.RandomElement(this.IncorrectHeaders);
      v.Elaboration = Utils.RandomElement(this.IncorrectElaborations);
      v.ConceedPrompt = Utils.RandomElement(this.IncorrectConceedPrompts);
    }
    v.WasCorrect = WasCorrect;
    v.CorrectAnswer = CorrectAnswer;
    this.OnVerdictChange == null ? console.warn("No Action set for VerdictManager.OnVerdictChange") : this.OnVerdictChange(v);
  }



}
