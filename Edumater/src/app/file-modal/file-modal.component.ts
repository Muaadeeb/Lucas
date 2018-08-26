import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SavedQuestionsData, VerifyQuestions } from '../common/SavedQuestionsData';
import { Question } from '../common/Question';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '../file.service';

@Component({
  selector: 'app-file-modal',
  templateUrl: './file-modal.component.html',
  styleUrls: ['./file-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FileModalComponent implements OnInit {
  output$: Subject<SavedQuestionsData>;
  data: SavedQuestionsData;
  error: string = "";
  @ViewChild("content") content: TemplateRef<Object>;
  activeModal: NgbModalRef;
  constructor(private fileService: FileService,
    private modalService: NgbModal) {
    this.data = new SavedQuestionsData();
  }

  ngOnInit() {
  }
  submit() {
    let files = (<HTMLInputElement>document.getElementById("OpenQuestionFile")).files;
    this.fileService.open(files).
      subscribe((qn) => {
        console.log(qn);
      },
      (error) => {
        console.log(error);
        this.error = error;
      })
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
    this.error = "";
    this.output$.error("Question Modal was closed before questions could be loaded.");
  }

  public RetrieveQuestions(): Observable<SavedQuestionsData> {
    this.output$ = new Subject<SavedQuestionsData>();
    this.activeModal = this.modalService.open(this.content);
    return this.output$;
  }

}

