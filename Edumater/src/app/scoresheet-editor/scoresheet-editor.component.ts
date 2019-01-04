import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Scoresheet } from '../common/Scoresheet';
import { ScoreResult } from '../score.service';

@Component({
  selector: 'app-scoresheet-editor',
  templateUrl: './scoresheet-editor.component.html',
  styleUrls: ['./scoresheet-editor.component.css']
})
export class ScoresheetEditorComponent implements OnInit {
  @Input() scoresheet: Scoresheet;
  @Output() change: EventEmitter<void> = new EventEmitter<void>();
  constructor() {
    
  }

  ngOnInit() {

  }

  onChange() {
    this.change.emit();
  }
}
