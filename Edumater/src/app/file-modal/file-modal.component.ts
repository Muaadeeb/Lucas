import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { IQuestionSource } from '../common/QuestionManager';
import { Observable, throwError, Subject, of } from 'rxjs';
import { SavedQuestionsData, VerifyQuestions } from '../common/SavedQuestionsData';
import { Question } from '../common/Question';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-file-modal',
  templateUrl: './file-modal.component.html',
  styleUrls: ['./file-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FileModalComponent implements OnInit, IQuestionSource {
  output$: Subject<SavedQuestionsData>;
  data: SavedQuestionsData;
  error: string = "";
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
        if (this.data === undefined || this.data === null) {
          this.error = "It appears your data's missing some pieces.";
        } else if (this.data.SaveName === null || !this.data.Questions || this.data.Questions.length === 0) {
          this.error = "Question File was unnamed or contained no questions (odds are it is a corrupted file)";
        } else if (VerifyQuestions(this.data.Questions,(error) => this.error=error)) {
          this.error = "";
        }
      }
      fr.readAsText(file);
    } else {
      this.error = "No File selected (or perhaps your browser isn't supported)";
    }
  }
  questionsAccepted() {
    if (this.error == "") {
      this.activeModal.close();
      this.activeModal = null;
      this.output$.next(this.data);
    }
  }
  questionsClosed() {
    this.activeModal.dismiss();
    this.activeModal = null;
    this.output$.error(throwError("Question Modal was closed before questions could be loaded."))
  }

  public RetrieveQuestions(): Observable<SavedQuestionsData> {
    this.output$ = new Subject<SavedQuestionsData>();
    this.activeModal = this.modalService.open(this.content);
    return this.output$;
  }

}

