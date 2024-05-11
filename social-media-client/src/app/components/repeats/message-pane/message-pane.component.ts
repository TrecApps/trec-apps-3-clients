import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ConversationEntry, Message, ProfileEntry } from '../../../models/Messaging';

@Component({
  selector: 'app-message-pane',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-pane.component.html',
  styleUrl: './message-pane.component.css'
})
export class MessagePaneComponent {

  @Input()
  conversationEntry: ConversationEntry = new ConversationEntry();

  messages: Message[] = [];

  displayNames: Map<string, string> = new Map<string, string>();
  
  constructor(){

  }

  getDisplayName(id: string): string {
    let ret = this.displayNames.get(id);
    return ret || "( Unknown )";
  }

  createMessage(m: string, prof: string): Message {
    let ret = new Message();

    ret.contents = [m];
    ret.profile = prof;



    return ret;
  }
}
