import { Component } from '@angular/core';
import { MobileBarComponent } from '../../repeats/mobile-bar/mobile-bar.component';
import { CommonModule } from '@angular/common';
import { DisplayService } from '../../../services/display.service';
import { NotificationComponent } from '../notification/notification.component';

import { Notification } from '../../../models/Notification';

@Component({
  selector: 'app-notification-route',
  standalone: true,
  imports: [MobileBarComponent, CommonModule, NotificationComponent],
  templateUrl: './notification-route.component.html',
  styleUrl: './notification-route.component.css'
})
export class NotificationRouteComponent {
  displayService: DisplayService;

  notificationList: Notification[] = [];

  constructor(ds: DisplayService){
    this.displayService = ds;
  }

  onNotificationList(list: Notification[]){
    this.notificationList = list;
  }
}
