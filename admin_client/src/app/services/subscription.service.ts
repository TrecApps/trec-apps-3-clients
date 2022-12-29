import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Subscription } from '../models/subscription';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  retrieveSubscriptions(list: Subscription[]){
    this.httpClient.get<Subscription[]>(`${environment.subscription_url}Manage/Current`, {headers: this.authService.getHttpHeaders(true, false)}).
    subscribe((sub:Subscription[]) => {
      for(let s of sub){
        list.push(s);
      }
    });
  }

  observe = {
    next: (str: string) => {

    },
    error: (error: Response | any) => { 
      alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      if(error?.status == 401 || error ?.status == 403) {
        this.authService.clearAuth();
      }
    }
  }

  addNewSub(sub:Subscription) {
    sub.id = null;
    this.httpClient.post<string>(`${environment.subscription_url}Manage/Insert`, sub, {headers: this.authService.getHttpHeaders(true, true)}).pipe(take(1)).subscribe(this.observe);
  }

  updateSub(sub:Subscription){
    this.httpClient.put<string>(`${environment.subscription_url}Manage/Insert`, sub, {headers: this.authService.getHttpHeaders(true, true)}).pipe(take(1)).subscribe(this.observe);
    
  }
}
