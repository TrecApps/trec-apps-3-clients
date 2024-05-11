import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConversationEntry, EditMessage, Message, NewMessage, PostConversation, ProfileEntry, UpdateResponse } from '../models/Messaging';
import { ConnectionEntry } from '../models/Connection';
import { environment } from '../environments/environment';
import { ResponseObj } from '../models/ResponseObj';
import { UserService } from './user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  constructor(private authService:AuthService, private client: HttpClient, private userService: UserService) { }

  conversations: ConversationEntry[] = [];
  

  onLogin(){
    if(!environment.messaging_service_url.trim().length) return;

    let params = new HttpParams().append("app", environment.app_name);

    this.client.get<ConversationEntry[]>(`${environment.messaging_service_url}Conversations`, {
      headers: this.authService.getHttpHeaders(false, false), params
    }).subscribe({
      next: (ce: ConversationEntry[]) => this.conversations = ce
    })
  }

  toProfileEntry(profile: string, displayName: string): ProfileEntry{
    let ret = new ProfileEntry(profile,displayName);
    return ret;
  }

  prepConversation(profile: string, displayName:string, onConversationPrepped: Function){

    let entry: ConversationEntry | undefined;
    for(let cEntry of this.conversations){
      if(cEntry.participants.length == 2 && cEntry.participants.map((pe: ProfileEntry) => pe.profileId).includes(profile)){
        entry = cEntry;
      }
    }

    if(entry){
      onConversationPrepped(entry);
    } else {
      let conversationPost: PostConversation = new PostConversation();
      conversationPost.app = environment.app_name;
      conversationPost.profiles = [profile];
      this.client.post<ResponseObj>(`${environment.messaging_service_url}Conversations`, conversationPost, {
        headers: this.authService.getHttpHeaders(true, true)
      }).subscribe({
        next: (ro: ResponseObj) => {
          let conversationEntry: ConversationEntry = new ConversationEntry();
          if(!ro.id){
            onConversationPrepped(undefined);
            return;
          }
          conversationEntry.id = ro.id.toString();
          conversationEntry.apps = environment.app_name
          conversationEntry.creator = this.userService.getCurrentUserId()?.toString() || "";
          conversationEntry.participants = [this.toProfileEntry(conversationEntry.creator, this.userService.getCurrentDisplayName() || "( unknown )"), 
              this.toProfileEntry(profile, displayName)];
          conversationEntry.started = new Date(Date.now());
          onConversationPrepped(conversationEntry);
        },
        error: () => {
          onConversationPrepped(undefined);
        }
      })
    }
  }

  getMessages(conversationId: string, page: number, pageLocation: number): Observable<Message[]> {
    let params = new HttpParams().append("conversation", conversationId).append("page", page).append("pageLocation", pageLocation);

    return this.client.get<Message[]>(`${environment.messaging_service_url}Messages`, {
      headers: this.authService.getHttpHeaders(false, false), params
    });
  }

  sendMessage(message: string, conversation: string, encrypt: boolean = false): Observable<ResponseObj> {

    let newMessage: NewMessage = new NewMessage(message, conversation, encrypt);
    return this.client.post<ResponseObj>(`${environment.messaging_service_url}Messages`, newMessage, {
      headers: this.authService.getHttpHeaders(true, true)
    })
  }

  editMessage(message: string, conversation: string, page:number, messageEntry:number, encrypt: boolean = false): Observable<ResponseObj>{
    let editMessage: EditMessage = new EditMessage(message, conversation, page, messageEntry, encrypt);
    return this.client.put<ResponseObj>(`${environment.messaging_service_url}Messages`, editMessage, {
      headers: this.authService.getHttpHeaders(true, true)
    })

  }

  deleteMessage(conversation: string, page:number, pageLocation :number): Observable<ResponseObj> {
    
    let body = {
      page, pageLocation
    };

    return this.client.delete<ResponseObj>(`${environment.messaging_service_url}Messages/${conversation}`, {
      headers: this.authService.getHttpHeaders(true, true),
      body
    })
  }

  markRead(conversation: string, page:number, pageLocation :number): Observable<ResponseObj> {
    let body = {
      page, pageLocation
    };

    return this.client.put<ResponseObj>(`${environment.messaging_service_url}Messages/markRead/${conversation}`, {
      headers: this.authService.getHttpHeaders(true, true),
      body
    })
  }

  getUpdates(conversation: string, page:number, pageLocation :number): Observable<UpdateResponse> {
    let params = new HttpParams().append("page", page).append("pageLocation", pageLocation);

    return this.client.get<UpdateResponse>(`${environment.messaging_service_url}Messages/Updates/${conversation}`, {
      headers: this.authService.getHttpHeaders(true, true),
      params
    })
  }
}
