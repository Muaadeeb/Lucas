import { Component, OnInit, ViewChild } from '@angular/core';
import { QuestionService } from '../question.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { FileModalComponent } from '../file-modal/file-modal.component';
import { ToQuestionNode } from '../common/SavedQuestionNode';
import { QuestionNode, cloneNode } from '../common/QuestionNode';
import { FileService } from '../file.service';
import * as _ from "underscore";

@Component({
  selector: 'app-question-manager',
  templateUrl: './question-manager.component.html',
  styleUrls: ['./question-manager.component.css']
})
export class QuestionManagerComponent implements OnInit {
  @ViewChild("fileModal") fileModal: FileModalComponent;
  continueUrl: string;

  constructor(
    private qs: QuestionService,
    private fs: FileService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      map((params) => params.get("continue"))
    ).subscribe(url => this.continueUrl = url);
    
  }

  continueClick() {
    if (this.qs.QuestionsLoaded()) {
      this.router.navigate([this.continueUrl]);
    }
  }

  uploadClick() {
    this.fileModal.RetrieveQuestions()
      .subscribe((node) => {
        this.qs.AddNode(ToQuestionNode(node.Data))
      });
  }

  addNodeClick() {
    let node = new QuestionNode();
    this.qs.AddNode(node);
  }

  hierarchyQuestionAdded() {
    this.qs.UpdateQuestionSelection();
  }
  selectionChanged() {
    this.qs.UpdateQuestionSelection();
  }
  save() {
    this.fileModal.SaveQuestions(cloneNode(this.qs.RootNode));
  }
}
