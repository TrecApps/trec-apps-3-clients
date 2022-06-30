import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TcUser, UserPost, UserResponse } from '../models/User';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs';
import { AuthService } from './auth.service';
import { LoginToken, PasswordChange } from '../models/Login';
import { BooleanRef } from '../models/Holders';
import { Router } from '@angular/router';
import { SessionList } from '../models/Sessions';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser: TcUser;



  constructor(private httpClient: HttpClient, private authService: AuthService, private router: Router) {
    this.currentUser = new TcUser();
   }

   checkAuthClear(error: Response | any) {
    if(error.status && (error.status == 401 || error.status == 403)) {
      this.authService.clearAuth();
      this.currentUser = new TcUser();
    }
   }

  async refreshUser(ref: BooleanRef, callable: Function) {
    let observe = {
      next: (response: TcUser) => { 
        console.info("Birthday Value: ", response.birthday);
        this.currentUser = response;
        ref.value = true;
        callable();
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    };

    this.httpClient.get<TcUser>(`${environment.user_service_url}Users/Current`,{headers: this.authService.getHttpHeaders(true, false)}).pipe(take(1)).subscribe(observe);
  }

  async createUser(userPost: UserPost) {
    let observe = {
      next: (response: LoginToken) => {
        this.authService.setAuthorization(response);
        this.router.navigate(['/user']);
       },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    };

    this.httpClient.post<LoginToken>(`${environment.user_service_url}Users/createUser`, userPost).pipe(take(1)).subscribe(observe);
  }

  async changePassword(passwordChange: PasswordChange) {
    let observe = {
      next: (response: Object) => { },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    };

    this.httpClient.post(`${environment.user_service_url}Users/passwordUpdate`, passwordChange,
        {headers: this.authService.getHttpHeaders(true, true)}).pipe(take(1)).subscribe(observe);
  }

  async updateUser() {
    let observe = {
      next: (response: Object) => { },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    };

    this.httpClient.put(`${environment.user_service_url}Users/UserUpdate`, this.currentUser,
      {headers: this.authService.getHttpHeaders(true, true)}).pipe(take(1)).subscribe(observe);
  }

  async getSessions(sessionListFunction: Function, currentSessionFunction : Function) {
    let observe1 = {
      next: (response: SessionList) => { 
        console.log("SessionList is ", response.sessions.length);
        sessionListFunction(response);
        let observe2 = {
          next: (response: Object) => { 
            currentSessionFunction(response.toString());
          },
          error: (error: Response | any) => { 
            console.error("Error Getting Current Session!", error);

            if(error.error?.text) {
              currentSessionFunction(error.error.text.toString());
            }
            else {
              alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
            }
          }
        };
        let headers = this.authService.getHttpHeaders(true, false);
        headers = headers.append("Accept","text/plain;charset=UTF-8");
        this.httpClient.get(`${environment.user_service_url}Sessions/Current`,
          {headers }).pipe(take(1)).subscribe(observe2);


      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    };



    this.httpClient.get<SessionList>(`${environment.user_service_url}Sessions/List`,
      {headers: this.authService.getHttpHeaders(true, false)}).pipe(take(1)).subscribe(observe1);
    
  }

  async removeSession(sessionId: string, doNext: Function) {
    let observe = {
      next: (response: Object) => { 
        doNext();
      },
      error: (error: Response | any) => { 
        if(error.status && error.status == 200) {
          doNext();
        } else {
          alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
        }
      }
    };

    this.httpClient.delete(`${environment.user_service_url}Sessions/${sessionId}`,
      {headers: this.authService.getHttpHeaders(true, false)}).pipe(take(1)).subscribe(observe);
  }
}
