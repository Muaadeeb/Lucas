import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation, Input } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { SavedQuestionsData, VerifyQuestions } from '../common/SavedQuestionsData';
import { Question } from '../common/Question';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '../file.service';
import { QuestionNode, RecurseNodeChildren } from '../common/QuestionNode';
import * as _ from "underscore";
import { SavedQuestionNode } from '../common/SavedQuestionNode';
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
  flat: boolean = false;
  loadData: SavedQuestionsData;
  totalLoadedQuestions: number;
  saving: boolean = false;
  saveMode: SaveMode = "Monolithic";
  saveModes = {
    "Monolithic": {
      Description: "Bunch all questions together into one gigantic file."
    },
    "Directories": {
      Description: "Individual files and sub-folders"
    },
    "Flat": {
      Description: "Give each node its own file in a single directory"
    },
    "Custom": {
      Description: "Select nodes to decide between files and folders yourself"
    }
  };
  saveModeNames = _.keys(this.saveModes);
  error: string = "";
  @ViewChild("content") content: TemplateRef<Object>;
  activeModal: NgbModalRef;
  constructor(private fileService: FileService,
    private modalService: NgbModal) {
    this.saveData = new QuestionNode();
    this.loadData = null;
  }

  ngOnInit() {
  }
  submit() {
    let files = (<HTMLInputElement>document.getElementById("OpenQuestionFile")).files;
    this.fileService.open(files).
      subscribe((questionNode) => {
        this.loadData = questionNode;
        console.log(questionNode);
        let recurseCount = (qn: SavedQuestionNode) => {
          let childCounts:number[] = _.map(qn.Children, (child) => recurseCount(child));
          return _.reduce(childCounts, (memo,value) => memo+value,qn.Questions==null?0:qn.Questions.length);
        }
        this.totalLoadedQuestions = recurseCount(this.loadData.Data);
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
            this.saveData.Selected = true; //Select base node to indicate all nodes should be bunched together
            //Specifying Flat or not is not necessary, since both result in a single file
            break;
          case "Flat":
            RecurseNodeChildren(this.saveData, (qn) => { qn.Selected = !qn.Children });  //Ensure that all nodes ar selected and will get their own file.
            this.flat = true;
            break;
          case "Directories":
            RecurseNodeChildren(this.saveData, (qn) => { qn.Selected = !qn.Children });  //Ensure that all nodes ar selected and will get their own file.
            this.flat = false;
            break;
          case "Custom":
            //All settings for Custom are already set by the user.
            break;
          default:
            throw "Unknown save mode";
        }
        this.fileService.save(this.saveData, this.flat);
        this.activeModal.close();
      }
    } else {
      if (this.loadData) {
        this.activeModal.close();
        this.activeModal = null;
        this.output$.next(this.loadData);
      }
    }
  }
  questionsClosed() {
    this.activeModal.dismiss();
    this.activeModal = null;
    this.error = "";
    this.saveMode = "Monolithic";
    this.loadData = null;
    if (!this.saving) this.output$.error("Question Modal was closed before questions could be loaded.");
  }

  public RetrieveQuestions(): Observable<SavedQuestionsData> {
    this.output$ = new Subject<SavedQuestionsData>();
    this.saving = false;
    this.saveData = null;
    this.activeModal = this.modalService.open(this.content, { size: "lg" });
    return this.output$;
  }
  public SaveQuestions(questionNode: QuestionNode) {
    this.loadData = null;
    this.saveData = questionNode;
    this.saving = true;
    this.activeModal = this.modalService.open(this.content, { size: "lg" });
  }
}
