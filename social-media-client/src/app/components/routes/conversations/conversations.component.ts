import { Component } from '@angular/core';
import { MessagingService } from '../../../services/messaging.service';
import { MobileBarComponent } from '../../repeats/mobile-bar/mobile-bar.component';
import { DisplayService } from '../../../services/display.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MessagePaneComponent } from '../../repeats/message-pane/message-pane.component';
import { ConversationEntry } from '../../../models/Messaging';

@Component({
  selector: 'app-conversations',
  standalone: true,
  imports: [CommonModule, MobileBarComponent, RouterLink, MessagePaneComponent],
  templateUrl: './conversations.component.html',
  styleUrl: './conversations.component.css'
})
export class ConversationsComponent {

  messagingService: MessagingService;
  displayService: DisplayService;

  constructor(
    ms: MessagingService,
    ds: DisplayService
  ) {
    this.messagingService = ms;
    this.displayService = ds;
  }

  setConversation(entry: ConversationEntry) {
    this.messagingService.currentConversation = entry;
  }
}
