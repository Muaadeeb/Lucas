import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Observable, throwError, Subject, of } from 'rxjs';
import { SavedQuestionsData, VerifyQuestions } from '../common/SavedQuestionsData';
import { Question } from '../common/Question';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from "underscore";
declare var JSZip: any;

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
  constructor(private modalService: NgbModal) {
    this.data = new SavedQuestionsData();
  }

  ngOnInit() {
  }
  submit() {
    let files = (<HTMLInputElement>document.getElementById("OpenQuestionFile")).files;
    if (!files) {
      this.error = "No files selected";
    }
    let path: string[] = [];
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      if (file) {
        let fileType = file.name.split('.').pop();
        let fr = new FileReader();
        switch (fileType.toLowerCase()) {
          case "zip":
            let iterateOverFolder = this.iterateOverFolder;
            fr.onload = () => {
              var zipReader = new JSZip();
              try {
                // more files !
                zipReader.loadAsync(fr.result)
                  .then(this.handleZipLoad(path,this));
              } catch (e) {
                this.error = e;
                return;
              }
            }
            fr.readAsArrayBuffer(file);
            break;
          case "json":
            fr.onload = () => {
              this.handleFile(fr.result, path);
            }
            fr.readAsText(file);
            break;
          default:
            this.error = "Invalid File Type:  " + fileType;
            break;
        }

      } else {
        this.error = "No File selected (or perhaps your browser isn't supported)";
      }
    }
  }
  handleZipLoad(path: string[], context: FileModalComponent): (zip: any, path: string[]) => void {
    return (zip: any, relativePath: string[]) => {
      zip.forEach((relativePath, file) => {
          
      })
      context.iterateOverFolder(zip.files, zip, path, context);
    }
    //_.each(<_.Dictionary<{}>>zip.files,function (file, relativePath) {
    //  let newPath = path.concat([relativePath]);
    //  handleZipObject(file, zip, newPath);
    //})
  }
  handleZipObject(zipObject: any, zip: any, path: string[], context: FileModalComponent) {
    if (zipObject.dir) {
      context.iterateOverFolder(zip.folder(_.last(path)).files, zip, path, context);
    } else {
      zipObject.async("string").then((content) => context.handleFile(content, context.getNamePath(zipObject.name)));
    }
  }
  iterateOverFolder(folder: _.Dictionary<any>, zip: any, path: string[], context: FileModalComponent) {
    folder.forEach((relativePath, file) => {
      if (file) {
        let zipObject = folder[file];
        let newPath = path.concat(context.getNamePath(relativePath));
        context.handleZipObject(zipObject, zip, newPath, context);
      }
    }
    //_.each(folder, (file, relativePath) => {
    //  let newPath = path.concat([relativePath]);
    //  handleZipObject(file, zip, newPath);
    //});
  }
  getNamePath(name: string): string[] {
    if (name.toLowerCase().endsWith(".json")) {
      name = name.substring(0, name.length - 5);
    }
    let namePath = (<string>name).split("/").pop().split(".");
    return namePath;
  }
  handleFile(content: string, path: string[]) {
    console.log(`File at ${path.join("/")}, Content:  ${content}`);
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
    this.output$.error(throwError("Question Modal was closed before questions could be loaded."))
  }

  public RetrieveQuestions(): Observable<SavedQuestionsData> {
    this.output$ = new Subject<SavedQuestionsData>();
    this.activeModal = this.modalService.open(this.content);
    return this.output$;
  }

}

