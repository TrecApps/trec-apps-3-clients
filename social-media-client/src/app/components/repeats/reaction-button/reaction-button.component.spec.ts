import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactionButtonComponent } from './reaction-button.component';

describe('ReactionButtonComponent', () => {
  let component: ReactionButtonComponent;
  let fixture: ComponentFixture<ReactionButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactionButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReactionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
