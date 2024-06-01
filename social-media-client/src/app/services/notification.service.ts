import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../models/Notification';
import { environment } from '../environments/environment';
import { ResponseObj } from '../models/ResponseObj';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private client: HttpClient, private authService: AuthService) { }

  getNotifications() : Observable<Notification[]> {
    return this.getNotification(0);
  }

  getNotification(page: number) : Observable<Notification[]> {
    let params = new HttpParams().append("page", page);
    return this.client.get<Notification[]>(`${environment.profile_service_url}Notifications`, {
      params, headers: this.authService.getHttpHeaders(false, false)
    });
  }

  deleteNotifications(notifications: string[]) : Observable<ResponseObj> {
    return this.client.delete<ResponseObj>(`${environment.profile_service_url}Notifications`, {
      headers: this.authService.getHttpHeaders(false, false), body: notifications
    });
  }

  markNotifications(notifications: string[], read: boolean = false): Observable<ResponseObj> {
    let params = new HttpParams().append("read", read);
    return this.client.put<ResponseObj>(`${environment.profile_service_url}Notifications/mark`, notifications,{
      headers: this.authService.getHttpHeaders(true, true), params
    });
  }
}
