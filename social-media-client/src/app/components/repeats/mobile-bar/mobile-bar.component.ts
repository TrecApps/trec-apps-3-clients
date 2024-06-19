import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import { ProfileSel } from '../../../models/ProfileObjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { ImageEndpointType, Notification, NotificationStatus } from '../../../models/Notification';
import { MessagingService } from '../../../services/messaging.service';

@Component({
  selector: 'app-mobile-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mobile-bar.component.html',
  styleUrl: './mobile-bar.component.css'
})
export class MobileBarComponent implements OnInit, OnDestroy{

  userService: UserService;

  searchTerm:string = "";

  profilePicBase: string;
  profilePicBaseBrand: string;

  router: Router;
  profileSuggestions: ProfileSel[] = [];

  @Output()
  basicNotifications = new EventEmitter<Notification[]>();

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

  onLogout(){
    this.stopNotifications();
    this.authService.logout();
  }

  constructor(
    userService:UserService,
    router: Router, 
    private profileService: ProfileService,
    private authService: AuthService, 
    private notificationService: NotificationService,
    private messageService: MessagingService
  ) {
    this.profilePicBase = `${environment.image_service_url}Profile/of/`;
    this.profilePicBaseBrand = `${environment.image_service_url}Profile/byBrand/`;
    this.userService = userService;
    this.router = router;
  }

  ngOnInit(): void {

    this.onUpdateNotifications();
    
    this.notificationCheckerHandle = window.setInterval(() => {
      this.onUpdateNotifications();
    }, 10000);

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

    this.basicNotifications.emit(this.regularNotifications);
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

  routeTo(route: string){
    this.router.navigateByUrl(route);
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

  selectProfile(id: string){
    this.router.navigate(['profile'], {
      queryParams: {
        id
      }
    })
  }

}
