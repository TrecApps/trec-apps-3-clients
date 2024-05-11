import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ConversationEntry, Message, ProfileEntry } from '../../../models/Messaging';
import { MessagingService } from '../../../services/messaging.service';
import { UserService } from '../../../services/user.service';
import { ResponseObj } from '../../../models/ResponseObj';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-message-pane',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-pane.component.html',
  styleUrl: './message-pane.component.css',
  animations: [
    trigger('xHover',[
      state('hover', style({background: 'rgba(255,0,0,1.0)'})),
      state('leave', style({background: 'rgba(0,0,0, 0.0'})),
      transition('hover => leave', [ animate('0.33s')]),
      transition('leave => hover', [ animate('0.33s')])
    ])
  ]
})
export class MessagePaneComponent implements OnInit, OnDestroy{

  @Input()
  conversationEntry: ConversationEntry = new ConversationEntry();

  profile: string = "";

  messages: Message[] = [];

  subPageSize: number = 20; // Current
  pageSize: number = 100;

  page: number = 0;
  pageEarly: number = 0;

  displayNames: Map<string, string> = new Map<string, string>();

  fallbackProfile: string = "assets/icons/non-profile.png";

  inputMessage: string = "";

  xButtonHover = false;
  setHover(hover: boolean){
    this.xButtonHover = hover;
  }
  
  constructor(private messageService: MessagingService, private userService: UserService){

  }
  ngOnDestroy(): void {
    
  }

  closeMessage(){
    this.messageService.setConversation(undefined);
  }

  updateEarlyBounds(lowBounds: number){
    if(lowBounds){
      this.pageEarly -= this.subPageSize;
    }

    if(this.pageEarly <= 0){
      if(this.page){
        this.page--;
        this.pageEarly = this.pageSize - this.subPageSize;
      } else {
        this.pageEarly = 0;
      }
    }
  }

  ngOnInit(): void {

    let curProfile = this.userService.getCurrentUserId();

    if(this.conversationEntry.participants.length == 2){
      let altProfile = this.conversationEntry.participants[0].profileId;
      if(altProfile == curProfile){
        altProfile = this.conversationEntry.participants[0].profileId;
      }

      this.profile = this.userService.getProfileImageByProfile(altProfile);
    } else {
      this.profile = "assets/icons/non-profile.png";
    }

    this.page = this.conversationEntry.pages;
    this.pageEarly = this.conversationEntry.pageSize - this.subPageSize + 2;

    this.messages = [];
    this.retrieveMessages();
  }

  getDisplayName(profileId: string): string {
    for(let p of this.conversationEntry.participants){
      if(p.profileId == profileId)return p.displayName;
    }
    return "( unknown )";
  }

  loading: boolean = false;

  retrieveMessages(){
    this.loading = true;
    let lowBounds = Math.max(this.pageEarly, 0);

    this.messageService.getMessages(this.conversationEntry.id, this.page, lowBounds).subscribe({
      next: (m: Message[]) => {
        this.messages = m;
        this.updateEarlyBounds(lowBounds);
        this.loading = false;
      }
    })
  }


  sendMessage(){
    if(this.inputMessage.trim().length){
      this.messageService.sendMessage(this.inputMessage, this.conversationEntry.id).subscribe({
        next: (value: ResponseObj) => {
          this.inputMessage = "";
        }
      })
    }
  }

}
