import { Injectable } from '@angular/core';
import { TcBrand, TcUser, UserInfo } from '../models/UserObjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  id: String = "";

  topBarColor: String = "#3267D4";

  tcUser: TcUser | undefined;

  tcBrand: TcBrand | undefined;

  isCurrentUser(id: String | null) : boolean {
    if(!id){ return true; }

    return `User-${this.tcUser?.id}` == id;
  }

  getCurrentUserId(): String | undefined{
    if(this.tcBrand?.id){
      return `Brand-${this.tcBrand.id}`;
    }
    if(this.tcUser?.id){
      return `User-${this.tcUser.id}`;
    }
    return undefined;
  }

  getCurrentDisplayName() : string | undefined {
    return this.tcUser?.displayName;
  }

  constructor(private authService: AuthService, private router: Router, private client: HttpClient) { }

  refreshUser(callable: Function) {
    let observe = {
      next: (response: UserInfo) => { 
        this.tcUser = response.user;
        this.tcBrand = response.brand;
        callable();

      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
        if(error?.status == 401 || error?.status == 403){
          this.authService.clearAuth();
          this.router.navigate(['logon']);
        }
      }
    };

    this.client.get<UserInfo>(`${environment.user_service_url}Profile/User`,{headers: this.authService.getHttpHeaders(true, false)}).subscribe(observe);

  }
}
