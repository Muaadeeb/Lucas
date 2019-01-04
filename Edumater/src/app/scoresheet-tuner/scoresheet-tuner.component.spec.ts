import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoresheetTunerComponent } from './scoresheet-tuner.component';

describe('ScoresheetTunerComponent', () => {
  let component: ScoresheetTunerComponent;
  let fixture: ComponentFixture<ScoresheetTunerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoresheetTunerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoresheetTunerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
