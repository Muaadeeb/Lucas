import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionFileDisplayComponent } from './question-file-display.component';

describe('QuestionFileDisplayComponent', () => {
  let component: QuestionFileDisplayComponent;
  let fixture: ComponentFixture<QuestionFileDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionFileDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionFileDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
