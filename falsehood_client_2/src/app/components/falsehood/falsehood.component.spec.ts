import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FalsehoodComponent } from './falsehood.component';

describe('FalsehoodComponent', () => {
  let component: FalsehoodComponent;
  let fixture: ComponentFixture<FalsehoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FalsehoodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FalsehoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
