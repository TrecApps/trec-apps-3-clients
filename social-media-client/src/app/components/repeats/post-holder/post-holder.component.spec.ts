import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostHolderComponent } from './post-holder.component';

describe('PostHolderComponent', () => {
  let component: PostHolderComponent;
  let fixture: ComponentFixture<PostHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostHolderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
