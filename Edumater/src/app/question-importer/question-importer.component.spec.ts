import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionImporterComponent } from './question-importer.component';

describe('QuestionImporterComponent', () => {
  let component: QuestionImporterComponent;
  let fixture: ComponentFixture<QuestionImporterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionImporterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionImporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
