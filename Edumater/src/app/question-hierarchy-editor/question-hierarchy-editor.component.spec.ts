import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionHierarchyEditorComponent } from './question-hierarchy-editor.component';

describe('QuestionHierarchyEditorComponent', () => {
  let component: QuestionHierarchyEditorComponent;
  let fixture: ComponentFixture<QuestionHierarchyEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionHierarchyEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionHierarchyEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
