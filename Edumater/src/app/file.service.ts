import { Injectable } from '@angular/core';
import { QuestionNode } from './common/QuestionNode';
import { Observable, throwError, Subject } from 'rxjs';
declare var JSZip: any;
import * as _ from "underscore";
import { SavedQuestionNode } from './common/SavedQuestionNode';
import { SavedQuestionsData } from './common/SavedQuestionsData';


@Injectable({
  providedIn: 'root'
})
export class FileService {
  private fileStream: Subject<LoadedSavedQuestionsData>;
  constructor() { }
  open(files: FileList): Observable<LoadedSavedQuestionsData> {
    if (!files) {
      return throwError("No files selected");
    }
    this.fileStream = new Subject<LoadedSavedQuestionsData>();
    let path: string[] = [];
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      if (file) {
        let fileType = file.name.split('.').pop();
        let fr = new FileReader();
        switch (fileType.toLowerCase()) {
          case "zip":
            fr.onload = () => {
              var zipReader = new JSZip();
              try {
                // more files !
                zipReader.loadAsync(fr.result)
                  .then(this.handleZipLoad(path, this))
              } catch (e) {
                return throwError(e);
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
            return throwError("Invalid File Type:  " + fileType);
        }

      } else {
        return throwError("No File selected (or perhaps your browser isn't supported)");
      }
    }
    return this.fileStream.asObservable();
  }
  handleZipLoad(path: string[], context: FileService): (zip: any, path: string[]) => void {
    return (zip: any, relativePath: string[]) => {
      zip.forEach((relativePath, file) => {
        context.handleZipObject(file, zip, context);
      });
    };
  }
  handleZipObject(zipObject: any, zip: any, context: FileService) {
    if (!zipObject.dir) {
      zipObject.async("string").then((content) => context.handleFile(content, context.getNamePath(zipObject.name)));
    }
  }
  handleFile(content: string, path: string[]) {
    let data: SavedQuestionsData = null;
    if (content == "") {
      this.fileStream.error("Empty File at:  " + path.join("/"));
      return;
    }
    try {
      data = JSON.parse(content);
    } catch (e) {
      this.fileStream.error(`Error parsing data at:  ${path.join("/")} (${e})`);
      return;
    }
    this.fileStream.next(new LoadedSavedQuestionsData(path, data));
  }


  save(questionNode: QuestionNode, flat:boolean = false) {
    if (questionNode.Selected) { //Monolithic Style

    } else if (flat) { //Single dot-denoted directory style

    } else { //Directories!!!

    }
  }
  getNamePath(name: string): string[] {
    if (name.toLowerCase().endsWith(".json")) {
      name = name.substring(0, name.length - 5);
    }
    let namePath = name.split("/");
    let dotPath = _.reduce(_.rest(namePath, 1),
      (memo, item, index, list) => {
        return memo.concat(item.split("."));
      }, namePath[0].split("."));
    return dotPath;
  }
}

export class LoadedSavedQuestionsData {
  constructor(Path: string[], Data: SavedQuestionsData) {
    this.Path = Path;
    this.Data = Data;
  }
  Path: string[];
  Data: SavedQuestionsData;
}
