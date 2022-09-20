import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VidWatchComponent } from './vid-watch.component';

describe('VidWatchComponent', () => {
  let component: VidWatchComponent;
  let fixture: ComponentFixture<VidWatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VidWatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VidWatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
