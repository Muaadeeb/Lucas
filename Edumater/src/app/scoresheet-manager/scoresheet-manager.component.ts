import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ScoreService } from '../score.service';
import * as _ from "underscore";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Scoresheet } from '../common/Scoresheet';
import { saveAs } from "file-saver";

@Component({
  selector: 'app-scoresheet-manager',
  templateUrl: './scoresheet-manager.component.html',
  styleUrls: ['./scoresheet-manager.component.css']
})
export class ScoresheetManagerComponent implements OnInit {
  //We iterate over the scoresheet as a dictionary for when new datapoints are added in the future
  // (this will be one less thing to implement)
  private scoresheetData: [string, string][];
  private currentOperation: ScoresheetOperation;
  private saveFilename: string;
  private ScoresheetOperation = ScoresheetOperation;
  private modal: NgbModalRef;
  private errorText: string;
  constructor(private scoreService: ScoreService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.scoresheetData = _.pairs(this.scoreService.CurrentScoresheet);
  }

  saveScoresheet(scoresheetModal) {
    this.currentOperation = ScoresheetOperation.Save;
    this.modal = this.modalService.open(scoresheetModal);
  }

  loadScoresheet(scoresheetModal) {
    this.currentOperation = ScoresheetOperation.Load;
    this.modal = this.modalService.open(scoresheetModal);
  }

  scoresheetModalSubmit() {
    switch (+this.currentOperation) {
      case ScoresheetOperation.Load: {
        let file = (<HTMLInputElement>document.getElementById("scoresheetInput")).files[0];
        let fileExtension = file.name.split('.').slice(-2).join(".");
        if (!/scoresheet\s?\(?\d*\)?\.json/.test(fileExtension)) {
          this.errorText = "Invalild File Extension (scoresheets must end in '.scoresheet.json')";
          return;
        } else {
          let fr = new FileReader(); //DEAR RETURNING ME:  You're setting up scoresheet loading and saving functionality.
          fr.onload = () => {
            this.scoreService.CurrentScoresheet = JSON.parse(<string>fr.result);
          }
          fr.readAsText(file);
          this.modal.close();
        }

        break;
      }
      case ScoresheetOperation.Save: {
        saveAs(
          new Blob([JSON.stringify(
            this.scoreService.CurrentScoresheet
          )], {
              type: "text/plain;charset=utf-8"
            }),
          this.saveFilename + ".scoresheet.json");
        this.modal.close();
        break;
      }
      default:
        throw "Unkown Scoresheet Operation!";
    }

  }
}

enum ScoresheetOperation {
  Load, Save
}
