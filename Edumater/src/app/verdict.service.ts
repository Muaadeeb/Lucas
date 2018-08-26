import { Injectable } from '@angular/core';
import { Utils } from "./common/Utils";
import { Verdict } from './common/Verdict';

@Injectable({
  providedIn: 'root'
})
export class VerdictService {
  private CorrectHeaders: string[] = ["You're Right!", "Congratulations!", "Wow, you is smart","How you be so smart?", "BRILLIANT!","Niiiiiiiice"];
  private CorrectElaborations: string[] = [
    "You're supreme Intelligence has produced yet another incredible feat of rightness man has never witnessed before.",
    "The mind you possess has defeated yet another insurmountable obstacle unfortunate enough to set itself in your path.",
    "The world trembles in awe at the intelligence you have portrayed through this magnificient feat you just accomplished",
    "wow.",
    "I cannot fathom how you came by the brain that rests upon thine shoulders",
    "Dude, that was like, smart and stuff."
  ];
  private CorrectConceedPrompts: string[] = ["Why thank you", "Yes, yes, move on", "Well, duh", "Uh-huh.", ":)","You didn't know?","Well, yeah","I know, right?"];
  private IncorrectHeaders: string[] = ["You is wrong", "You is dumb", "DAAAAANNG", "Seriously?  That one was easy!", "WRONG.", "Why you be so stupid?", "Thou art unsmartified"];
  private IncorrectElaborations: string[] = [
    "That.... that was just dumb.  You messed up big time.",
    "Every man and woman on this planet has lost a considerable portion of thier intelligence as part of the idiot, stupid, preventable, and all-round idiotic mistake you just made.",
    "Seriously dude.  Get a brain.",
    "Dude, that was like, so not knarly",
    "Why you ackin so dum dum?",
    "Dum dum, give me gum gum",
    "Even your computer has turned against you now."
  ];
  private IncorrectConceedPrompts: string[] = ["I'm Dumb", "I conceed my stupidity", "I'll be less dumb next time", "Sorry.", "wubba lubba dub dub?","was I that far off?","I know...","I blame the controller"];
  public MakeVerdict(CorrectAnswer: string, WasCorrect: boolean): Verdict {
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
    return v;
  }



}
