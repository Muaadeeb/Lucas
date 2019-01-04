import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoresheetManagerComponent } from './scoresheet-manager.component';

describe('ScoresheetManagerComponent', () => {
  let component: ScoresheetManagerComponent;
  let fixture: ComponentFixture<ScoresheetManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoresheetManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoresheetManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
