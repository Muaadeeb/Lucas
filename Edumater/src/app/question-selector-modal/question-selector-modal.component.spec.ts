import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSelectorModalComponent } from './question-selector-modal.component';

describe('QuestionSelectorModalComponent', () => {
  let component: QuestionSelectorModalComponent;
  let fixture: ComponentFixture<QuestionSelectorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionSelectorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSelectorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
