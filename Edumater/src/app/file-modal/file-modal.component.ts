import { Component, OnInit, ViewChild } from '@angular/core';
import { IQuestionSource } from '../question.service';
import { Observable, throwError, Subject } from 'rxjs';
import { SavedQuestionsData } from '../SavedQuestionsData';
import { Question } from '../Question';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-file-modal',
  templateUrl: './file-modal.component.html',
  styleUrls: ['./file-modal.component.css']
})
export class FileModalComponent implements OnInit, IQuestionSource {
  output$: Subject<Question[]>;
  data: SavedQuestionsData;
  error: string;
  valid: boolean = false;
  @ViewChild("content") content: NgbModalRef;
  constructor(private modalService:NgbModal) { }

  ngOnInit() {
    this.data = null;
  }
  submit() {
    let file = (<HTMLInputElement>document.getElementById("OpenQuestionFile")).files[0];
    if (file) {
      let fr = new FileReader();
      fr.onload = () => {
        try {
          this.data = JSON.parse(fr.result);
        } catch (e) {
          this.error = e;
          return;
        }
        try {
          if (this.data.SaveName === null || !this.data.Questions || this.data.Questions.length === 0) {
            this.error = "Question File was unnamed or contained no questions (odds are it is a corrupted file)";
          } else {
            this.valid = true;
            this.error = "";
          }
        }catch (e) {
          this.error = "It appears your data's missing some pieces.";
        }

      }
      fr.readAsText(file);
    } else {
      this.error = "No File selected (or perhaps your browser isn't supported)";
    }
  }
  questionsAccepted() {
    if (this.valid) {
      this.content.close();
      this.output$.next(this.data.Questions);
    }
  }
  questionsClosed() {
    this.content.dismiss();
    this.output$.error(throwError("Question Modal was closed before questions could be loaded."))
  }

  public RetrieveQuestions(): Observable<Question[]> {
    this.output$ = new Subject<Question[]>();
    this.modalService.open(this.content);
    return this.output$;
  }
}

