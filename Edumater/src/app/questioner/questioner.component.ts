import { Component, OnInit, ViewChild } from '@angular/core';
import { FileModalComponent } from '../file-modal/file-modal.component';
import { QuestionManager } from '../common/QuestionManager';

@Component({
  selector: 'app-questioner',
  templateUrl: './questioner.component.html',
  styleUrls: ['./questioner.component.css']
})
export class QuestionerComponent implements OnInit {
  @ViewChild("questionFileModal") questionFileModal: FileModalComponent;
  qm: QuestionManager;
  constructor() { }

  ngOnInit() {
    this.qm = new QuestionManager(this.questionFileModal);
  }

}
