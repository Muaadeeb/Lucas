import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreprocessorEditorComponent } from './scoreprocessor-editor.component';

describe('ScoreprocessorEditorComponent', () => {
  let component: ScoreprocessorEditorComponent;
  let fixture: ComponentFixture<ScoreprocessorEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreprocessorEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreprocessorEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
