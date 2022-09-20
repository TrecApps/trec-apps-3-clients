import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VidOverviewComponent } from './vid-overview.component';

describe('VidOverviewComponent', () => {
  let component: VidOverviewComponent;
  let fixture: ComponentFixture<VidOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VidOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VidOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
