import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Login, LoginToken } from '../models/Login';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginToken: LoginToken | null;

  constructor(private httpClient: HttpClient, private router: Router) {
    this.loginToken = null;
  }

  hasActiveTokens(): boolean {
    return this.loginToken != null;
  }

  attemptRefresh(func: Function | undefined): void {
    // If we have a cookie, then we'll send it to the refresh Endpoint
    this.httpClient.get<LoginToken>(`${environment.datalist_url}refresh_token`, {
      withCredentials: true
    }).subscribe(
    {
      next: (tok: LoginToken) => {
        this.loginToken = tok;

        if(func){
          func();
        } else {
          this.router.navigateByUrl("main");
        }

        
      },
      error:  (e) => {
        console.log("Failed to Refresh", e);
        this.router.navigateByUrl("logon");
      }
    })
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

    this.httpClient.post<LoginToken>(`${environment.datalist_url}Auth/login`, login).pipe(take(1)).subscribe(observe);
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

  logout() {
    this.httpClient.get(`${environment.datalist_url}Auth/logout`, {headers:this.getHttpHeaders(true, false)});
    this.clearAuth();
  }
}
