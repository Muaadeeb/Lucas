
import { Injectable, PACKAGE_ROOT_URL } from '@angular/core';
import { QuestionNode, RecurseNodeChildren } from './common/QuestionNode';
import { Observable, throwError, Subject, of, forkJoin } from 'rxjs';
import * as _ from "underscore";
import { SavedQuestionsData } from './common/SavedQuestionsData';
import { saveAs } from "file-saver";
import { ToSavedQuestionNode, SavedQuestionNode } from './common/SavedQuestionNode';
//import * as JSZip from "jszip";
declare var JSZip: any;

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private fileStream: Subject<SavedQuestionsData>;
  constructor() { }
  private setValueAtPath(data: SavedQuestionNode, path: string[], value: SavedQuestionNode) {
    let child = data;
    let children: { [name: string]: SavedQuestionNode } = {};
    for (var i = 0; i < path.length; i++) {
      var name = path[i];
      if (i === 0 && name === data.Name) {
        continue; //Skip this iteration if the path requests the root node
      }
      children = _.object(_.map(child.Children, (node) => node.Name), child.Children);
      if (name in children) {
        child = children[name];
      } else {
        let newchild = new SavedQuestionNode(name, null, []);
        child.Children.push(newchild);
        child = newchild;
      }
    }
    child.Questions = value.Questions;
  }
  open(files: FileList, onFileLoad?: (progressCurrent: number, progressTotal: number, filedata: SavedQuestionsData) => void): Observable<SavedQuestionsData> {
    if (!files) {
      return throwError("No files selected");
    }
    this.fileStream = new Subject<SavedQuestionsData>();
    let rootNodeName = files.length == 1 ? files[0].name.replace(/\.[^/.]+$/, "") : "Root";
    let output = new SavedQuestionsData(new SavedQuestionNode(rootNodeName, null, []));
    let completed: _.Dictionary<boolean> = _.reduce(files, (acc, cur) => ({ ...acc, [cur.name]: false }), {});
    let complete = (file: File, result: SavedQuestionsData) => {
      if (files.length === 1) output.Data = result.Data;
      else output.Data.Children.push(result.Data);
      completed[file.name] = true;
      if (output.CreateDate == null || output.CreateDate < result.CreateDate) {
        output.CreateDate = result.CreateDate;
      }
      let values = _.values(completed);
      let counts = _.countBy(values);
      if (onFileLoad) onFileLoad(counts["true"], values.length, result);
      console.log(counts);
      if (counts["true"] === values.length) {
        this.fileStream.next(output);
        this.fileStream.complete();
      }
    }

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      if (file) {
        let fileType = file.name.split('.').pop();
        let fr = new FileReader();
        switch (fileType.toLowerCase()) {
          case "zip":
            fr.onload = () => {
              let result: SavedQuestionsData = new SavedQuestionsData(new SavedQuestionNode(file.name.replace(/\.[^/.]+$/, ""), [], []), file.lastModifiedDate);
              var zipReader = new JSZip();
              try {
                let totalObjs = 0;
                let completedObjs = 0;
                let foreachComplete = false;
                // more files !
                zipReader.loadAsync(fr.result)
                  .then((zip) => {
                    zip.forEach((relativePath, fileobj) => {
                      totalObjs++;
                      this.handleZipObject(fileobj, this).subscribe((res) => {
                        if (res)
                          this.setValueAtPath(result.Data, res.Path.slice(1), res.Data.Data); //Skip the first item in the path
                        completedObjs++;
                        if (totalObjs == completedObjs && foreachComplete) {
                          complete(file, result);
                        }
                      });
                    });
                    foreachComplete = true;
                  })
              } catch (e) {
                return throwError(e);
              }
            }
            fr.readAsArrayBuffer(file);

            break;
          case "json":
            fr.onload = () => {
              complete(file, this.handleFile(<string>fr.result, []).Data);
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
  handleZipObject(zipObject: any, context: FileService): Observable<LoadedSavedQuestionsData> {
    if (!zipObject.dir) {
      return new Observable((subscriber) => {
        zipObject.async("string").then((content) => {
          subscriber.next(context.handleFile(content, context.getNamePath(zipObject.name)));
          subscriber.complete();
        });
      })
    } else {
      return of(null);
    }
  }
  handleFile(content: string, path: string[]): LoadedSavedQuestionsData {
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
    return new LoadedSavedQuestionsData(path, data);
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
        this.DataFromSelection(questionNode).subscribe((data) => {
          zip.file(this.createFilename(data.path, data.qn.Data.Name, "."), JSON.stringify(data.qn));
        })
      } else { //Directories!!!
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
  DataFromSelection(questionNode: QuestionNode): Observable<{ qn: SavedQuestionsData, path: string[] }> {
    return new Observable((observer) => {
      let recurse = (qn: QuestionNode, oldPath: string[]) => {
        //The entire node if this node has no children or is selected, the node's questions alone (minus the children) otherwise
        let data: QuestionNode = (qn.Children == null || qn.Selected) ? qn : _.omit(qn, "Children");
        let newPath = _.clone(oldPath);
        newPath.push(qn.Name);
        if (qn.Selected || qn.Questions) {
          observer.next({ qn: new SavedQuestionsData(ToSavedQuestionNode(data)), path: oldPath });

        }
        if(!qn.Selected) {
          if (qn.Children) {
            qn.Children.forEach((qn) => recurse(qn, newPath));
          }
        }
      }
      recurse(questionNode, []);
    })
  }
  createFilename(path: string[], filename: string, seperator: string) {
    return `${_.union(path,[filename]).join(seperator)}.json`;
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
