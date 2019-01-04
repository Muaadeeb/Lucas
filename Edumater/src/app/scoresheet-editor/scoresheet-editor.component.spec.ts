import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoresheetEditorComponent } from './scoresheet-editor.component';

describe('ScoresheetEditorComponent', () => {
  let component: ScoresheetEditorComponent;
  let fixture: ComponentFixture<ScoresheetEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoresheetEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoresheetEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
