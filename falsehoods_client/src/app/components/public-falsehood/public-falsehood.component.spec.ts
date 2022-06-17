import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicFalsehoodComponent } from './public-falsehood.component';

describe('PublicFalsehoodComponent', () => {
  let component: PublicFalsehoodComponent;
  let fixture: ComponentFixture<PublicFalsehoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicFalsehoodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicFalsehoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
