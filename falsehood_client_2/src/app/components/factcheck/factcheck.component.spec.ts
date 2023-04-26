import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactcheckComponent } from './factcheck.component';

describe('FactcheckComponent', () => {
  let component: FactcheckComponent;
  let fixture: ComponentFixture<FactcheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactcheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactcheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
