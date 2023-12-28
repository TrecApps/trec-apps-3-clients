import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreProfileComponent } from './pre-profile.component';

describe('PreProfileComponent', () => {
  let component: PreProfileComponent;
  let fixture: ComponentFixture<PreProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
