import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImageEndpointType, Notification, NotificationStatus } from '../../../models/Notification';
import { Router } from '@angular/router';
import { MessagingService } from '../../../services/messaging.service';
import { NotificationService } from '../../../services/notification.service';
import { environment } from '../../../environments/environment';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {

  @Input()
  notifications: Notification[] = [];

  @Output()
  handled = new EventEmitter<void>();

  @Output()
  remove = new EventEmitter<Notification>();

  constructor(
    private router: Router,
    private messageService: MessagingService,
    private notificationService: NotificationService
  ){
    
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
    this.handled.emit();
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

  getStyle(n: NotificationStatus) : string {
    return `font-wieght: ${n == NotificationStatus.READ ? 'regular' : 'bold'}`;
  }

  removeNotificationCall(_t51: Notification) {
    this.notificationService.deleteNotifications([_t51.notificationId]).subscribe({
      next: () => {
        this.remove.emit(_t51);
      }
    })
  }
}
