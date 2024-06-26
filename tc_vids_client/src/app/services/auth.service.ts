import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginToken, Login } from '../models/Login';

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

  clearAuth() {
    this.loginToken = null;
  }

  loginThroughTrecApps(login: Login, callable: Function) {

    let observe = {
      next: (response: LoginToken) => { 
        console.log("Response is : {}", response.toString());
          this.loginToken = response;
          console.log("Response of Login Token is : {}", this.loginToken.toString());
          // To-Do: Add Callback
          callable(true);
        
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
        callable(false);
      }
    };

    this.httpClient.post<LoginToken>(`${environment.tc_vids_url}Auth/login`, login).pipe(take(1)).subscribe(observe);
  }

  getHttpHeaders(useJson: boolean, usingContentType : boolean) : HttpHeaders {
    console.log("Getting Headers!");
    let ret:HttpHeaders = new HttpHeaders();
    ret = ret.append('Authorization', this.getAuthorization());
    if(usingContentType) {
    ret = ret.append('Content-Type', useJson ? 
     'application/json': 'application/x-www-form-urlencoded');
    }
   return ret;
  }

  setAuthorization(loginToken: LoginToken) {
    this.loginToken = loginToken;
  }

  getAuthorization() : string {
    console.log("Auth Token is ", this.loginToken);
    return this.loginToken && this.loginToken.access_token ? this.loginToken.access_token : "";
  }
}
