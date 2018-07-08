import { Component, OnInit, Input } from '@angular/core';
import { SavedQuestionsData } from '../SavedQuestionsData';

@Component({
  selector: 'app-question-file-display',
  templateUrl: './question-file-display.component.html',
  styleUrls: ['./question-file-display.component.css']
})
export class QuestionFileDisplayComponent implements OnInit {
  @Input() data: SavedQuestionsData;
  constructor() { }

  ngOnInit() {
  }
//  $("#OpenQuestionFileQCount").text(data.Questions.length + " Qs");
//$("#OpenQuestionFileName").text(data.SaveName || "<No Save Name>");
//$("#OpenQuestionFileCreated").text(data.CreateDate === undefined ? "<No Create Date>"
//  : (data.CreateDate.toLocaleDateString() + " at " + data.CreateDate.toLocaleTimeString()))
//$("#OpenQuestionFileNotes").text(data.Notes || "<No Notes>");
//$("#OpenQuestionFileInfo").removeClass("hidden");
//$("#OpenQuestionFileInfo").removeClass("bg-danger");
}
