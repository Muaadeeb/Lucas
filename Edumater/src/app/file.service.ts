
import { Injectable, PACKAGE_ROOT_URL } from '@angular/core';
import { QuestionNode, RecurseNodeChildren } from './common/QuestionNode';
import { Observable, throwError, Subject } from 'rxjs';
import * as _ from "underscore";
import { SavedQuestionsData } from './common/SavedQuestionsData';
import { saveAs } from "file-saver";
import { ToSavedQuestionNode } from './common/SavedQuestionNode';
//import * as JSZip from "jszip";
declare var JSZip: any;

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
                  .then(this.handleZipLoad(this))
              } catch (e) {
                return throwError(e);
              }
            }
            fr.readAsArrayBuffer(file);
            break;
          case "json":
            fr.onload = () => {
              this.handleFile(<string>fr.result, []);
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
  handleZipLoad(context: FileService): (zip: /*JSZip*/any) => void {
    return (zip: any) => {
      zip.forEach((relativePath, file) => {
        context.handleZipObject(file, context);
      });
    };
  }
  handleZipObject(zipObject: any, context: FileService) {
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

  //onUpdate is only called when the style is not Monolithic (that is, the root question node is not selected)
  save(questionNode: QuestionNode, flat: boolean = false, onUpdate?: (percent: number, file: string) => void) {
    if (questionNode.Selected) { //Monolithic Style
      saveAs(
        new Blob([JSON.stringify(
          new SavedQuestionsData(ToSavedQuestionNode(questionNode))
        )], {
            type: "text/plain;charset=utf-8"
          }),
        questionNode.Name.replace("/", "_") + ".json");
    } else {
      var zip = new JSZip();
      if (flat) { //Single-directory dot-denoted hierarchy reprentation ("I/Like/Movies.json" -> "I.Like.Movies.json")
        //RecurseNodeChildren<string[]>(questionNode, (qn, path) => {
        //  zip.file(this.createFilename(path, qn.Name, "."), "");
        //  path.push(qn.Name);
        //  return path;
        //}, []);
        this.DataFromSelection(questionNode).subscribe((data) => {
          zip.file(this.createFilename(data.path, data.qn.Data.Name, "."), JSON.stringify(data.qn));
        })
      } else { //Directories!!!
        //let recurse = (qn: QuestionNode, path: string[]) => {
        //  let data: QuestionNode = (qn.Children == null || qn.Selected) ? qn : _.omit(qn, "Children");
        //  zip.file(this.createFilename(path, qn.Name, "/"), ToSavedQuestionNode(data));
        //  if (qn.Children) {
        //    path = _.clone(path);
        //    path.push(qn.Name);
        //    qn.Children.forEach((qn) => recurse(qn, path));
        //  }
        //}
        //recurse(questionNode, []);
        this.DataFromSelection(questionNode).subscribe((data) => {
          zip.file(this.createFilename(data.path, data.qn.Data.Name, "/"), JSON.stringify(data.qn));
        })
      }
      zip.generateAsync({ type: "blob" }, (metadata) => {
        if (onUpdate) onUpdate(metadata.percent, metadata.currentFile);
      }).then((b) => {
        saveAs(b, questionNode.Name.replace("/", "_") + ".zip");
      });
    }
  }
  DataFromSelection(questionNode: QuestionNode): Observable<{qn: SavedQuestionsData, path: string[]}> {
    return new Observable((observer) => {
      let recurse = (qn: QuestionNode, path: string[]) => {
        let data: QuestionNode = (qn.Children == null || qn.Selected) ? qn : _.omit(qn, "Children");
        //zip.file(this.createFilename(path, qn.Name, "/"), ToSavedQuestionNode(data));
        if (qn.Selected) {
          observer.next({ qn: new SavedQuestionsData(ToSavedQuestionNode(data)), path: path });
        }
        else {
          if (qn.Children) {
            path = _.clone(path);
            path.push(qn.Name);
            qn.Children.forEach((qn) => recurse(qn, path));
          }
        }
      }
      recurse(questionNode, []);
    })
  }
  createFilename(path: string[], filename: string, seperator: string) {
    return `${path.join(seperator)}${seperator}${filename}.json`;
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
