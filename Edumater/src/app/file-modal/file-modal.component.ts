import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { IQuestionSource } from '../question.service';
import { Observable, throwError, Subject, of } from 'rxjs';
import { SavedQuestionsData } from '../SavedQuestionsData';
import { Question } from '../Question';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-file-modal',
  templateUrl: './file-modal.component.html',
  styleUrls: ['./file-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FileModalComponent implements OnInit, IQuestionSource {
  output$: Subject<Question[]>;
  data: SavedQuestionsData;
  error: string;
  valid: boolean = false;
  @ViewChild("content") content: TemplateRef<Object>;
  activeModal: NgbModalRef;
  constructor(private modalService: NgbModal) {
    this.data = new SavedQuestionsData();
  }

  ngOnInit() {
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
        } catch (e) {
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
      this.activeModal.close();
      this.activeModal = null;
      this.output$.next(this.data.Questions);
    }
  }
  questionsClosed() {
    this.activeModal.dismiss();
    this.activeModal = null;
    this.output$.error(throwError("Question Modal was closed before questions could be loaded."))
  }

  public RetrieveQuestions(): Observable<Question[]> {
    this.output$ = new Subject<Question[]>();
    this.activeModal = this.modalService.open(this.content);
    return this.output$;
  }

}

