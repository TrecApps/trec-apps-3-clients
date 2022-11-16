import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Login, TcUser, UserInfo } from '../models/Login';
import { LoginToken } from '../models/Login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginToken: LoginToken | null;

  user: UserInfo = new UserInfo("", 0);

  currentUser: TcUser;
  profileFallback = "/assets/Unknown_Profile.png";
  profilePic: String;

  constructor(private httpClient: HttpClient) {
    this.loginToken = null;
    this.profilePic = this.profileFallback;

    this.currentUser = new TcUser();
  }

  private refreshTokenCallback() {
    
  }

  loginThroughTrecApps(login: Login, callable: Function) {

    let observe = {
      next: (response: LoginToken) => { 
        console.log("Response is : {}", response.toString());
          this.loginToken = response;
          console.log("Response of Login Token is : {}", this.loginToken.toString());
          // To-Do: Add Callback
          callable(true);
          this.getUserInfo();
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
        callable(false);
      }
    };

    this.httpClient.post<LoginToken>(`${environment.falsehood_submit_url}Auth/login`, login).pipe(take(1)).subscribe(observe);
  }

  private updateProfilePic()
  {
   let observe = {
     next: (response: string) => {
       console.log("Response was " + response);
       this.profilePic = `${environment.falsehood_search_url}profile/file/${this.currentUser.id}.${response}`;
     }
   }

   this.httpClient.get(`${environment.falsehood_search_url}profile/imageType/${this.currentUser.id}`, {responseType: 'text'}).pipe(take(1)).subscribe(observe);
  }

  private getUserInfo() {
    let observe = {
      next: (response: TcUser) => {
        this.currentUser = response;

        this.updateProfilePic();

        this.user.credibility = response.credibilityRating ? response.credibilityRating : 0;
        this.user.username = response.userProfile ? response.userProfile : "";
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    }
    let headers:HttpHeaders = new HttpHeaders();
    headers = headers.append('Authorization', this.getAuthorization());
    this.httpClient.get<TcUser>(`${environment.falsehood_submit_url}Auth/user`,{headers}).pipe(take(1)).subscribe(observe);
  }

  getHttpHeaders(useJson: boolean) : HttpHeaders {
    console.log("Getting Headers!");
    let ret:HttpHeaders = new HttpHeaders();
    ret = ret.append('Authorization', this.getAuthorization());
    ret = ret.append('Content-Type', useJson ? 
     'application/json': 'application/x-www-form-urlencoded');
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
