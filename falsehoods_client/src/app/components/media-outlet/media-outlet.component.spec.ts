import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaOutletComponent } from './media-outlet.component';

describe('MediaOutletComponent', () => {
  let component: MediaOutletComponent;
  let fixture: ComponentFixture<MediaOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaOutletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
