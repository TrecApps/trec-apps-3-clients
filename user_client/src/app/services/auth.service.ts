import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Login, LoginToken } from '../models/Login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginToken: LoginToken | null;

  constructor(private httpClient: HttpClient) {
    this.loginToken = null;
  }

  private refreshTokenCallback() {
    
  }

  loginThroughTrecApps(login: Login, callable: Function) {

    let observe = {
      next: (response: Object) => { 
        if(response instanceof LoginToken){
          this.loginToken = response;

          // To-Do: Add Callback
        }
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    };

    this.httpClient.post(`${environment.user_service_url}Auth/login`, login).pipe(take(1)).subscribe(observe);
  }

  getHttpHeaders(useJson: boolean) : HttpHeaders {
    let ret:HttpHeaders = new HttpHeaders();
    ret.append('Authorization', this.getAuthorization());
    ret.append('Content-Type', useJson ? 
     'application/json': 'application/x-www-form-urlencoded');
   return ret;
  }

  getAuthorization() : string {
    return this.loginToken && this.loginToken.access_token ? this.loginToken.access_token : "";
  }
}
