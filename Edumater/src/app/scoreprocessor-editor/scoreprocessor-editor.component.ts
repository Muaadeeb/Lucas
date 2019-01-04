import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ScoreProcessor } from '../common/Scoresheet';


@Component({
  selector: 'app-scoreprocessor-editor',
  templateUrl: './scoreprocessor-editor.component.html',
  styleUrls: ['./scoreprocessor-editor.component.css']
})
export class ScoreprocessorEditorComponent implements OnInit {
  @Input() scoreProcessor: ScoreProcessor;
  @Output() change: EventEmitter<void> = new EventEmitter<void>()
  constructor() {
   
  }

  ngOnInit() {
  }

  onChange() {
    this.change.emit();
  }
}
