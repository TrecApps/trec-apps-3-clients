import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ProfileSel } from '../../../models/ProfileObjs';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from '../../../services/auth.service';
import { ImageEndpointType, Notification, NotificationStatus } from '../../../models/Notification';
import { NotificationService } from '../../../services/notification.service';
import { MessagingService } from '../../../services/messaging.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css',
  animations: [
    trigger('translate', [
      state('collapse', style({ height: '0px', overflow: 'hidden'})),
      state('expanded', style({ height: '*', overflow: 'hidden'})),
      transition('collapse => expanded', [ animate('0.33s')]),
      transition('expanded => collapse', [animate('0.33s')])
    ]),
    trigger('rotate', [
      state('collapse', style({ transform: 'rotate(180deg)'})),
      state('expanded', style({ transform: 'rotate(270deg)'})),
      transition('collapse => expanded', [ animate('0.33s')]),
      transition('expanded => collapse', [animate('0.33s')])
    ])
  ]
})
export class TopBarComponent implements OnInit, OnDestroy{



  removeNotificationConnection(_t51: Notification) {
    this.notificationService.deleteNotifications([_t51.notificationId]).subscribe({
      next: () => {
        this.connectionNotifications = this.connectionNotifications.filter((n: Notification) => {
          return n.notificationId != _t51.notificationId
        })
      }
    })
  }

  removeNotificationMessage(_t51: Notification) {
    this.notificationService.deleteNotifications([_t51.notificationId]).subscribe({
      next: () => {
        this.messageNotifications = this.messageNotifications.filter((n: Notification) => {
          return n.notificationId != _t51.notificationId
        })
      }
    })
  }

  removeNotificationRegular(_t51: Notification) {
    this.notificationService.deleteNotifications([_t51.notificationId]).subscribe({
      next: () => {
        this.regularNotifications = this.regularNotifications.filter((n: Notification) => {
          return n.notificationId != _t51.notificationId
        })
      }
    })
  }

  userService: UserService;

  profileSuggestions: ProfileSel[] = [];

  profilePicBase: string;
  profilePicBaseBrand: string;

  searchTerm: string = "";


  wFriends: string = "assets/icons/w-friends.png";
  bFriends: string = "assets/icons/b-friends.png";
  curFriends: string = this.wFriends;

  wMessage: string = "assets/icons/w-message.png";
  bMessage: string = "assets/icons/b-message.png";
  curMessage: string = this.wMessage;

  wBell: string = "assets/icons/w-bell.png";
  bBell: string = "assets/icons/b-bell.png";
  curBell: string = this.wBell;


  menuExtended: boolean = false;

  // Notification Management
  connectionNotifications: Notification[] = [];
  connectionNotificationCounter: number = 0;
  showConnectionNotes: boolean = false;
  messageNotifications: Notification[] = [];
  messageNotificationCounter: number = 0;
  showMessageNotes: boolean = false;
  regularNotifications: Notification[] = [];
  regularNotificationCounter: number = 0;
  showRegularNotes: boolean = false;


  notificationCheckerHandle: number = 0;



  toggleMenuExtension(){
    this.menuExtended = !this.menuExtended;
  }

  onHoverFriends(entered: boolean){
    this.curFriends = entered ? this.bFriends : this.wFriends;
  }

  onHoverMessage(entered: boolean){
    this.curMessage = entered ? this.bMessage : this.wMessage;
  }

  onHoverBell(entered: boolean){
    this.curBell = entered ? this.bBell : this.wBell;
  }

  onLogout(){
    this.stopNotifications();
    this.authService.logout();
  }

  
  constructor(
    userService: UserService, 
    private router: Router, 
    private profileService: ProfileService, 
    private authService: AuthService, 
    private notificationService: NotificationService,
    private messageService: MessagingService
  ){
    this.userService = userService;
    this.profilePicBase = `${environment.image_service_url}Profile/of/`;
    this.profilePicBaseBrand = `${environment.image_service_url}Profile/byBrand/`;
  }
  ngOnInit(): void {

    this.onUpdateNotifications();
    
    this.notificationCheckerHandle = window.setInterval(() => {
      this.onUpdateNotifications();
    }, 10000);

    // document.addEventListener('click', (event) => {
    //   if(this.showConnectionNotes || this.showMessageNotes || this.showRegularNotes) {
    //     this.showConnectionNotes = this.showMessageNotes = this.showRegularNotes = false;
    //   }
    // })
  }

  stopNotifications(){
    if(this.notificationCheckerHandle){
      window.clearInterval(this.notificationCheckerHandle);
      this.notificationCheckerHandle = 0;
    }
  }

  ngOnDestroy(): void {
    this.stopNotifications();
  }

  onUpdateNotifications(){
    this.notificationService.getNotifications().subscribe({
      next: (notifications: Notification[]) => {
        for(let n of notifications){
          switch(n.post.category) {
            case "Messaging":
              this.addMessageNotification(n);
              break;
            case "Connection":
              this.addConnectionNotification(n);
              break;
            default:
              this.addGeneralNotification(n);
          }
        }
      }
    })
  }

  addConnectionNotification(notification: Notification) {
    this.connectionNotifications = this.updateNotificationList(notification, this.connectionNotifications);

    let unseen = this.connectionNotifications.filter((n: Notification) => {
      return n.status.toString() == "UNSEEN";
    });
    this.connectionNotificationCounter = unseen.length;
  }

  addMessageNotification(notification: Notification) {
    this.messageNotifications = this.updateNotificationList(notification, this.messageNotifications);

    if(notification.post.relevantId && notification.status.toString() == "UNSEEN")
      this.messageService.messageSignal.set(notification.post.relevantId)

    let unseen = this.messageNotifications.filter((n: Notification) => {
      return n.status.toString() == "UNSEEN";
    });
    this.messageNotificationCounter = unseen.length;
  }

  addGeneralNotification(notification: Notification){
    this.regularNotifications = this.updateNotificationList(notification, this.regularNotifications);

    let unseen = this.regularNotifications.filter((n: Notification) => {
      return n.status.toString() == "UNSEEN";
    });
    this.regularNotificationCounter = unseen.length;
  }

  isNotificationNew(notification: Notification, list: Notification[]) : boolean {
    let ret: boolean = true;
    
    list.forEach((n: Notification) => {
      if(!n.post.time || !notification.post.time) return;
      if(n.post.time > notification.post.time) {
        ret = false;
      }
    })

    return ret;
  }

  updateNotificationList(notification: Notification, list: Notification[]) : Notification[]
  {
    if(!this.isNotificationNew(notification, list)){
      return list;
    }

    list = list.filter((n: Notification) => {
      return n.notificationId != notification.notificationId;
    })

    list.push(notification);
    return list;
  }

  toggleRegularNotes(){
    this.showConnectionNotes = false;
    this.showMessageNotes = false;
    this.showRegularNotes = !this.showRegularNotes;

    if(this.showRegularNotes){
      let updates = this.regularNotifications.filter((n: Notification) => {
        return n.status == NotificationStatus.UNSEEN;
      }).map((n: Notification) => n.notificationId);
      this.notificationService.markNotifications(updates).subscribe({
        next: ()=> {
          for(let n of this.regularNotifications){
            if(n.status == NotificationStatus.UNSEEN){
              n.status = NotificationStatus.UNREAD
            }
          }
        }
      })
    }
  }

  toggleMessageNotes(){
    this.showConnectionNotes = false;
    this.showMessageNotes = !this.showMessageNotes;
    this.showRegularNotes = false;

    if(this.showMessageNotes){
      let updates = this.messageNotifications.filter((n: Notification) => {
        return n.status == NotificationStatus.UNSEEN;
      }).map((n: Notification) => n.notificationId);
      this.notificationService.markNotifications(updates).subscribe({
        next: ()=> {
          for(let n of this.messageNotifications){
            if(n.status == NotificationStatus.UNSEEN){
              n.status = NotificationStatus.UNREAD
            }
          }
        }
      })
    }
  }

  getStyle(n: NotificationStatus) : string {
    return `font-wieght: ${n == NotificationStatus.READ ? 'regular' : 'bold'}`;
  }

  toggleConnectionNotes() {
    this.showConnectionNotes = !this.showConnectionNotes;
    this.showMessageNotes = false;
    this.showRegularNotes = false;

    if(this.showConnectionNotes){
      let updates = this.connectionNotifications.filter((n: Notification) => {
        return n.status.toString() == "UNSEEN";
      }).map((n: Notification) => n.notificationId);
      this.notificationService.markNotifications(updates).subscribe({
        next: ()=> {
          for(let n of this.connectionNotifications){
            if(n.status.toString() == "UNSEEN"){
              n.status = NotificationStatus.UNREAD
            }
          }
        }
      })
    }
  }

  getNotificationImage(n: Notification): string {
    if(!n.post.imageId) return "assets/icons/non-profile.png";

    switch(n.post.type?.toString()){
      case "BRAND_PROFILE":
        return `${environment.image_service_url}Profile/byBrand/${n.post.imageId}?app=${environment.app_name}`;
      case "USER_PROFILE":
        return `${environment.image_service_url}Profile/of/${n.post.imageId}?app=${environment.app_name}`;
      default:
        return `${environment.image_service_url}ImageRetrieval/simpleId/${n.post.imageId}`;
    }
  }

  handleNotification(n: Notification) {
    if(n.post.category == "Connection"){
      this.router.navigate(['profile'], {
        queryParams: {
          id: n.post.relevantId
        }
      })
    } else if(n.post.category == "Messaging"){
      if(n.post.relevantId){
        this.messageService.setConversationById(n.post.relevantId);
      }
    }

    this.notificationService.markNotifications([n.notificationId], true).subscribe({
      next: () => {
        n.status = NotificationStatus.READ
      }
    })
    this.showConnectionNotes = this.showMessageNotes = this.showRegularNotes = false;
  }

  navToProfile(){
    this.router.navigate(['profile'], {queryParams:{
      id: this.userService.getCurrentUserId()
    }})
  }

  navToHome(){
    this.router.navigate(['home']);
  }

  selectProfile(id: string){
    this.router.navigate(['profile'], {
      queryParams: {
        id
      }
    })
  }

  onSearchChange(){
    if(this.searchTerm.length == 0){
      this.profileSuggestions = [];
      return;
    }
    this.profileService.searchProfiles(this.searchTerm).subscribe({
      next: (sel: ProfileSel[])=> {
        this.profileSuggestions = sel;
      }
    })
  }
}
