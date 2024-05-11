import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagePaneComponent } from './message-pane.component';

describe('MessagePaneComponent', () => {
  let component: MessagePaneComponent;
  let fixture: ComponentFixture<MessagePaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagePaneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessagePaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
