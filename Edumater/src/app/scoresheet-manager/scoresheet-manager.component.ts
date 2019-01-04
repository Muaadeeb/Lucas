import { Component, OnInit } from '@angular/core';
import { ScoreService } from '../score.service';
import * as _ from "underscore";

@Component({
  selector: 'app-scoresheet-manager',
  templateUrl: './scoresheet-manager.component.html',
  styleUrls: ['./scoresheet-manager.component.css']
})
export class ScoresheetManagerComponent implements OnInit {
  //We iterate over the scoresheet as a dictionary for when new datapoints are added in the future
  // (this will be one less thing to implement)
  private scoresheetData: [string, string][]; 
  constructor(private scoreService: ScoreService) { }

  ngOnInit() {
    this.scoresheetData = _.pairs(this.scoreService.CurrentScoresheet);
  }

}
