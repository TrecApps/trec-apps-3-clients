import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagePaneHolderComponent } from './message-pane-holder.component';

describe('MessagePaneHolderComponent', () => {
  let component: MessagePaneHolderComponent;
  let fixture: ComponentFixture<MessagePaneHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagePaneHolderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessagePaneHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
