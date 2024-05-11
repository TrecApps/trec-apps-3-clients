import { Component } from '@angular/core';
import { MessagingService } from '../../services/messaging.service';
import { CommonModule } from '@angular/common';
import { MessagePaneComponent } from '../repeats/message-pane/message-pane.component';

@Component({
  selector: 'app-message-pane-holder',
  standalone: true,
  imports: [CommonModule, MessagePaneComponent],
  templateUrl: './message-pane-holder.component.html',
  styleUrl: './message-pane-holder.component.css'
})
export class MessagePaneHolderComponent {

  messageService: MessagingService;

  constructor(messageService: MessagingService){
    this.messageService = messageService;
  }


}
