import { Component, OnInit } from '@angular/core';
import { IImporter } from '../common/IImporter';
import { TextImporter } from './text-importer/TextImporter';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-question-importer',
  templateUrl: './question-importer.component.html',
  styleUrls: ['./question-importer.component.css']
})
export class QuestionImporterComponent implements OnInit {
  private sourceDict: SourceDict = {
    name: "root",
    suboptions: [
      {
        name: "File",
        suboptions: [
          {
            name: "Text",
            importer: TextImporter
          },
          {
            name: "JSON"
          },
          {
            name: "CSV"
          }
        ]
      },
      {
        name: "Internet",
        suboptions: [
          {
            name: "Yeah, sorry, no internet importers yet"
          }
        ]
      }
    ]
  }
  currentOptions: SourceDict;
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.currentOptions = this.sourceDict;
  }
  optionClick(option: SourceDict) {
    if (option.importer != null) {
      let importer = new option.importer();
      if (importer.Import) {
        var result = importer.Import(this.modalService);
        console.log(result);
      } else {
        throw "Invalid Importer!  Import function missing.  Option name:  " + option.name;
      }
    } else if (option.suboptions == null) {
      alert("It seems you've hit an in-progress section of the Great and Almighty Importer.  You might need to go back");
      this.currentOptions = this.sourceDict;
    } else {
      this.currentOptions = option;
    }
  }
}

class SourceDict { name: string; importer?: { new() => IImporter }; suboptions?: SourceDict[] } []
