import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionRouteComponent } from './connection-route.component';

describe('ConnectionRouteComponent', () => {
  let component: ConnectionRouteComponent;
  let fixture: ComponentFixture<ConnectionRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionRouteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectionRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
