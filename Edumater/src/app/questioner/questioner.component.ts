import { Component, OnInit, ViewChild } from '@angular/core';
import { FileModalComponent } from '../file-modal/file-modal.component';

@Component({
  selector: 'app-questioner',
  templateUrl: './questioner.component.html',
  styleUrls: ['./questioner.component.css']
})
export class QuestionerComponent implements OnInit {
  @ViewChild("questionFileModal") questionFileModal: FileModalComponent;
  constructor() { }

  ngOnInit() {
    this.questionFileModal.RetrieveQuestions();
  }

}
