import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicFigureComponent } from './public-figure.component';

describe('PublicFigureComponent', () => {
  let component: PublicFigureComponent;
  let fixture: ComponentFixture<PublicFigureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicFigureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicFigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
