import { CommonModule } from '@angular/common';
import { Component, EffectRef, ElementRef, Input, OnDestroy, OnInit, Signal, ViewChild, computed, effect } from '@angular/core';
import { ConversationEntry, LatestMessageList, Message, ProfileEntry } from '../../../models/Messaging';
import { MessagingService } from '../../../services/messaging.service';
import { UserService } from '../../../services/user.service';
import { ResponseObj } from '../../../models/ResponseObj';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-message-pane',
  standalone: true,
  imports: [CommonModule, FormsModule, ],
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

  @Input()
  maxSizeStyle: string = "max-width: 100%; max-height: 100%";

  @ViewChild("mainMessagePane", { read: ElementRef })
  mainMessagePane: ElementRef<HTMLDivElement> | undefined;

  // @ViewChild("topMessagePane", { read: ElementRef })
  // topMessagePane: ElementRef<HTMLDivElement> | undefined;

  // @ViewChild("bottomMessagePane", { read: ElementRef })
  // bottomMessagePane: ElementRef<HTMLDivElement> | undefined;

  @Input()
  paneHeight: string = ""

  profile: string = "";

  messages: Message[] = [];

  subPageSize: number = 20; // Current
  pageSize: number = 100;

  page: number = 0;
  pageEarly: number = 0;
  latestPage: number = 0;

  pageRange: number[] = [];


  displayNames: Map<string, string> = new Map<string, string>();

  fallbackProfile: string = "assets/icons/non-profile.png";

  inputMessage: string = "";

  imageBaseUrl = environment.image_service_url;
  appName = environment.app_name;

  xButtonHover = false;

  messageUpdateAlerter: EffectRef;

  doScrollDown: boolean = true;

  setScrollDown(scrollDown: boolean){
    this.doScrollDown = scrollDown;

    this.scrollToBottom();
  }

  scrollToBottom(){
    if(!this.doScrollDown || !this.mainMessagePane) return;

    this.mainMessagePane.nativeElement.scrollTop = this.mainMessagePane.nativeElement.scrollHeight;
  }

  setHover(hover: boolean){
    this.xButtonHover = hover;
  }


  scrollTracker: number = 0;
  
  constructor(private messageService: MessagingService, private userService: UserService){
    this.messageUpdateAlerter = effect(() => {
      let id: string = this.messageService.messageSignal();
      if(id.length && id == this.conversationEntry.id){
        this.retrieveMessagesV2();
      }
      return id;
    });


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

    if(this.mainMessagePane){
      this.scrollTracker = this.mainMessagePane.nativeElement.scrollTop;
    }

    let curProfile = this.userService.getCurrentUserId();

    if(this.conversationEntry.participants.length == 2){
      let altProfile = this.conversationEntry.participants[0].profileId;
      if(altProfile == curProfile){
        altProfile = this.conversationEntry.participants[1].profileId;
      }

      this.profile = this.userService.getProfileImageByProfile(altProfile);
    } else {
      this.profile = "assets/icons/non-profile.png";
    }

    this.page = this.conversationEntry.pages;
    this.pageEarly = this.conversationEntry.pageSize - this.subPageSize + 2;

    this.messages = [];
    this.retrieveLatest();
  }

  getDisplayName(profileId: string): string {
    for(let p of this.conversationEntry.participants){
      if(p.profileId == profileId)return p.displayName;
    }
    return "( unknown )";
  }

  loading: boolean = false;

  retrieveMessages(onUpdated?: Function | undefined){
    this.loading = true;
    let lowBounds = Math.max(this.pageEarly, 0);

    this.messageService.getMessages(this.conversationEntry.id, this.page, lowBounds).subscribe({
      next: (m: Message[]) => {
        this.appendMessages(m);
        if(m.length >= this.subPageSize){
          this.pageEarly += this.subPageSize;
          this.retrieveMessages();
        }
          
        // this.updateEarlyBounds(lowBounds);
        this.loading = false;
        if(onUpdated) onUpdated();
        setTimeout(() => {
          this.scrollToBottom();
        }, 100);
      }
    })
  }

  slidePage(increase: boolean){
    if(increase){
      this.updatePage(this.page + 1);
    } else {
      if(!this.page) return;
      this.updatePage(this.page - 1);
    }
  }

  

  updatePage(p: number){
    this.page = p;

    this.retrieveMessagesV2();
    this.updatePageRange();
  }

  retrieveLatest(){
    this.loading = true;

    this.messageService.getLatestMessagesV2(this.conversationEntry.id).subscribe({
      next: (list: LatestMessageList) => {
        this.page = this.latestPage = list.latestPage;
        this.messages = list.messages;
        this.loading = false;

        setTimeout(() => {
          this.scrollToBottom();
        }, 100);
      }
    })
  }

  retrieveMessagesV2(onUpdated?: Function | undefined){
    this.loading = true;

    this.messageService.getMessagesV2(this.conversationEntry.id, this.page).subscribe({
      next: (m: Message[]) => {
        this.loading = false;
        if(!m.length){
          if(this.page) this.page--;
          return;
        }
        this.messages = m;

        this.updatePageRange();
          
        // this.updateEarlyBounds(lowBounds);
        
        if(onUpdated) onUpdated();
        setTimeout(() => {
          this.scrollToBottom();
        }, 100);
      }
    })
  }

  updatePageRange(){
    this.pageRange = [];
    for(let i = this.page - 3; i <= this.page + 3; i++){
      this.pageRange.push(i);
    }

    this.pageRange = this.pageRange.filter((value: number) => value > 0 && value < this.latestPage);
  }



  appendMessages(m: Message[]) {
    if(!m.length) return;
    if(this.messages.length){
      let lastMessage = this.messages[this.messages.length - 1];
      let start = 0;
      for(let curMessageLoc = 0; curMessageLoc < m.length; curMessageLoc++){
        start = curMessageLoc;
        let curMessage = m[curMessageLoc];
        if(curMessage.page > lastMessage.page || (curMessage.page == lastMessage.page && curMessage.messageLocation > lastMessage.messageLocation))
          break;
      }

      if(start < m.length){
        this.messages.concat(m.slice(start));
      }

    } else {
      this.messages = m;
    }
  }

  handleScroll(event:Event){
    if(!this.mainMessagePane) return;

    if(this.mainMessagePane.nativeElement.scrollTop < this.scrollTracker){
      this.doScrollDown = false;
    }

    this.scrollTracker = this.mainMessagePane.nativeElement.scrollTop;
  }


  sendMessage(){
    if(this.inputMessage.trim().length){
      this.messageService.sendMessage(this.inputMessage, this.conversationEntry.id).subscribe({
        next: (value: ResponseObj) => {
          this.inputMessage = "";
          this.retrieveMessagesV2();
        }
      })
    }
  }

}
