import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TcUser, UserPost } from '../models/User';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs';
import { AuthService } from './auth.service';
import { PasswordChange } from '../models/Login';
import { BooleanRef } from '../models/Holders';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser: TcUser;

  constructor(private httpClient: HttpClient, private authService: AuthService) {
    this.currentUser = new TcUser();
   }

  async refreshUser(ref: BooleanRef, callable: Function) {
    let observe = {
      next: (response: TcUser) => { 
        this.currentUser = response;
        ref.value = true;
        callable();
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    };

    this.httpClient.get<TcUser>(`${environment.user_service_url}Users/Current`).pipe(take(1)).subscribe(observe);
  }

  async createUser(userPost: UserPost) {
    let observe = {
      next: (response: Object) => { },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    };

    this.httpClient.post(`${environment.user_service_url}Users/createUser`, userPost).pipe(take(1)).subscribe(observe);
  }

  async changePassword(passwordChange: PasswordChange) {
    let observe = {
      next: (response: Object) => { },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    };

    this.httpClient.post(`${environment.user_service_url}Users/passwordUpdate`, passwordChange,
        {headers: this.authService.getHttpHeaders(true)}).pipe(take(1)).subscribe(observe);
  }

  async updateUser() {
    let observe = {
      next: (response: Object) => { },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    };

    this.httpClient.put(`${environment.user_service_url}Users/UserUpdate`, this.currentUser,
      {headers: this.authService.getHttpHeaders(true)}).pipe(take(1)).subscribe(observe);
  }
}
