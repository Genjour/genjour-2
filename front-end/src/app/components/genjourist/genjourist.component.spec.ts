import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenjouristComponent } from './genjourist.component';

describe('GenjouristComponent', () => {
  let component: GenjouristComponent;
  let fixture: ComponentFixture<GenjouristComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenjouristComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenjouristComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
