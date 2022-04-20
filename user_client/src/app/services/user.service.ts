import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserPost } from '../models/User';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs';
import { AuthService } from './auth.service';
import { PasswordChange } from '../models/Login';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

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
}
