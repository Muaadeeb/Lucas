import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation, Input } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { SavedQuestionsData, VerifyQuestions } from '../common/SavedQuestionsData';
import { Question } from '../common/Question';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '../file.service';
import { QuestionNode } from '../common/QuestionNode';
import * as _ from "underscore";
type SaveMode = "Monolithic" | "Flat" | "Directories" | "Custom";

@Component({
  selector: 'app-file-modal',
  templateUrl: './file-modal.component.html',
  styleUrls: ['./file-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FileModalComponent implements OnInit {
  output$: Subject<SavedQuestionsData>;
  saveData: QuestionNode;
  data: SavedQuestionsData;
  saving: boolean = false;
  saveMode: SaveMode = "Monolithic";
  saveModes = {
    "Monolithic": {
      Description: "Bunch all questions together into one gigantic file."

    }
  };
  saveModeNames = _.keys(this.saveModes);
  error: string = "";
  @ViewChild("content") content: TemplateRef<Object>;
  activeModal: NgbModalRef;
  constructor(private fileService: FileService,
    private modalService: NgbModal) {
    this.saveData = new QuestionNode();
    this.data = new SavedQuestionsData();
  }

  ngOnInit() {
  }
  submit() {
    let files = (<HTMLInputElement>document.getElementById("OpenQuestionFile")).files;
    this.fileService.open(files).
      subscribe((qn) => {
        console.log(qn);
        this.data = qn.Data;
      },
        (error) => {
          console.log(error);
          this.error = error;
        })
  }
  questionsAccepted() {
    if (this.saving) {
      if (this.saveData) {
        switch (this.saveMode) {
          case "Monolithic":
            break;
          case "Flat":
            break;
          case "Directories":
            break;
          case "Custom":
            break;
          default:
            throw "Unknown save mode";
        }
        this.fileService.save(this.saveData);
        this.activeModal.close();
      }
    } else {
      if (this.data) {
        this.activeModal.close();
        this.activeModal = null;
        this.output$.next(this.data);
      }
    }
  }
  questionsClosed() {
    this.activeModal.dismiss();
    this.activeModal = null;
    this.error = "";
    this.saveMode = "Monolithic";
    this.output$.error("Question Modal was closed before questions could be loaded.");
  }

  public RetrieveQuestions(): Observable<SavedQuestionsData> {
    this.output$ = new Subject<SavedQuestionsData>();
    this.saving = false;
    this.saveData = null;
    this.activeModal = this.modalService.open(this.content, { size: "lg" });
    return this.output$;
  }
  public SaveQuestions(questionNode: QuestionNode) {
    this.data = null;
    this.saveData = questionNode;
    this.saving = true;
    this.activeModal = this.modalService.open(this.content, { size: "lg" });
  }
}
