import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaFalsehoodComponent } from './media-falsehood.component';

describe('MediaFalsehoodComponent', () => {
  let component: MediaFalsehoodComponent;
  let fixture: ComponentFixture<MediaFalsehoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaFalsehoodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaFalsehoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
