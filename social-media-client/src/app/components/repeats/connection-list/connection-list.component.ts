import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ConnectionService } from '../../../services/connection.service';
import { UserService } from '../../../services/user.service';
import { ConnectionEntry, ConnectionRequestTarget, ConnectionStatus, ConnectionType } from '../../../models/Connection';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseObj } from '../../../models/ResponseObj';
import { Router } from '@angular/router';
import { BlockService } from '../../../services/block.service';
import { MessagingService } from '../../../services/messaging.service';
import { ConversationEntry } from '../../../models/Messaging';
import { DisplayService } from '../../../services/display.service';

@Component({
  selector: 'app-connection-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './connection-list.component.html',
  styleUrl: './connection-list.component.css'
})
export class ConnectionListComponent implements OnInit {
  
  connections: ConnectionStatus[] = [];

  @Input()
  mode: string = "";

  @Input()
  profileId: string = "";

  userId: string = "";

  @Input()
  userDisplayName: string = "";

  userImage: string = `${environment.image_service_url}Profile/of/`;
  brandImage: string = `${environment.image_service_url}Profile/byBrand/`;
  cAppName: string = environment.app_name;


  constructor(
    private connectionServcie: ConnectionService,
    private userService: UserService,
    private router: Router,
    private blockService: BlockService,
    private messageService: MessagingService,
    private displayService: DisplayService){

  }

  switchToProfile(id: string){
    this.router.navigate(['profile'], {queryParams:{
      id
    }})
  }

  onPrepare(){
    if(!this.connections.length){
      this.ngOnInit();
    }
  }

  ngOnInit(): void {
    let res = this.userService.getCurrentUserId();
    if(!res) return;
    this.userId = res.toString();

    if(this.profileId == ""){
      
      this.profileId = this.userId;
    }

    switch(this.mode){
      case "REQUESTED":
        this.loadUserSelfConnections(ConnectionRequestTarget.REQUESTERS);
        break;
      case "AWAITING":
        this.loadUserSelfConnections(ConnectionRequestTarget.REQUESTEES);
        break;
      case "CONFIRMED":
        this.loadUserSelfConnections(ConnectionRequestTarget.CONFIRMED);
        break;
      case "ALL":
        this.loadUserProfileConnections();
    }
  }

  loadUserProfileConnections(){
    this.connectionServcie.getConnectionListByOther(this.profileId).subscribe({
      next: (cs: ConnectionStatus[]) => {
        this.connections = cs;

        this.connections.sort((a: ConnectionStatus, b: ConnectionStatus) => {
          return a.statusToViewer.localeCompare(b.statusToViewer);
        })
      }
    })
  }

  loadUserSelfConnections(cr: ConnectionRequestTarget){

    let conObs: Observable<ConnectionEntry[]>;
    switch(cr)
    {
      case ConnectionRequestTarget.CONFIRMED:
        conObs = this.connectionServcie.getConnectionList(ConnectionRequestTarget.CONFIRMED);
        break;
      case ConnectionRequestTarget.REQUESTEES:
        conObs = this.connectionServcie.getConnectionList(ConnectionRequestTarget.REQUESTEES);
        break;
      case ConnectionRequestTarget.REQUESTERS:
        conObs = this.connectionServcie.getConnectionList(ConnectionRequestTarget.REQUESTERS);
        break;
      default:
        return;
    }

    conObs.subscribe({
      next: (connectionList: ConnectionEntry[]) => {

        let cl: ConnectionStatus[] = connectionList.map((ce: ConnectionEntry) => {
          
          let status = "";
          let dispayName = ce.otherDisplayName;
          let isRequester = this.userId == ce.requester;
          let id = isRequester ? ce.requestee : ce.requester;

          switch(ce.type){
            case ConnectionType.REQUESTED:
            case 'REQUESTED':
              status = isRequester ? "AWAITING" : "REQUESTED";
              break;
            case ConnectionType.CONFIRMED:
            case 'CONFIRMED':
              status = "CONNECTED";
              break;
            default:
              status = "INVALID";
          }

          return new ConnectionStatus(id, dispayName, status, ce.id);


        });

        this.connections = cl.filter((cs: ConnectionStatus) => {
          return cs.statusToViewer != "INVALID";
        })
      }
    })
  }

  makeConnectionRequest(cs: ConnectionStatus){
    this.connectionServcie.makeConnectionRequest(cs.profileId).subscribe({
      next: (v: ResponseObj) => {
        if(v.id){
          cs.id = parseInt(v.id.toString());
        }
        cs.statusToViewer = "AWAITING";
      }
    })
  }

  initiateBlock(cs: ConnectionStatus){
    let allApps = confirm("Do you wish to block this person Across all of TrecApps?");

    if(!confirm("Are you sure you wish to block this person. You will not be visible to them.")){
      return;
    }

    this.blockService.blockPerson(cs.profileId, !allApps).subscribe({
      next: (ro: ResponseObj) => {
        alert(`Successfully Blocked ${cs.displayName}`);
      },
      error: (ro: ResponseObj) => {
        alert(ro.message);
      }
    })
  }

  makeConnectionResponse(cs:ConnectionStatus, approve: boolean){
    this.connectionServcie.makeConnectionResponse(cs.profileId, approve).subscribe({
      next: (v: ResponseObj) => {
        cs.statusToViewer = approve ? "CONFIRMED" : "NOT_FOUND";
      }
    })
  }

  removeConnection(cs: ConnectionStatus){
    if(confirm(`Are you sure you want to remove your connection ${cs.statusToViewer == 'AWAITING' ? 'request ': ''}to ${cs.displayName}`))
    {
      this.connectionServcie.removeConnection(cs.id).subscribe({
        next: (v: ResponseObj)=> {
          cs.id = -1;
          cs.statusToViewer = "NOT_FOUND";
        }
      })
    }
  }

  initiateMessage(cs: ConnectionStatus) {
    this.messageService.prepConversation(cs.profileId, cs.displayName, (val: ConversationEntry | undefined) => {
      if(!val){
        alert("Could not initiate Conversation");
      } else {
        this.messageService.setConversation(val);
        if(this.displayService.isMobile){
          this.router.navigateByUrl("/messages");
        }
      }
    })
  }

}
