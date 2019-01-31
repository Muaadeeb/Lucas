import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextImporterComponent } from './text-importer.component';

describe('TextImporterComponent', () => {
  let component: TextImporterComponent;
  let fixture: ComponentFixture<TextImporterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextImporterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextImporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
