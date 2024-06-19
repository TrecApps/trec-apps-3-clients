import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationRouteComponent } from './notification-route.component';

describe('NotificationRouteComponent', () => {
  let component: NotificationRouteComponent;
  let fixture: ComponentFixture<NotificationRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationRouteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
