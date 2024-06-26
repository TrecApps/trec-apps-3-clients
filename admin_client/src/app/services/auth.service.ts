import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Login, LoginToken } from '../models/Login';
import { TcUser } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loginToken: LoginToken | null;

  currentUser: TcUser;
  profileFallback = "/assets/Unknown_Profile.png";
  profilePic: String;

  permissions: string[] = [];

  // To-Do: Allow for other languages
  language = "en-US";

  hasPermission(permission: string): boolean{
    for(let p of this.permissions){
      if( p == permission) {
        return true;
      }
    }
    return false;
  }

  constructor(private httpClient: HttpClient) {
    this.loginToken = null;
    this.profilePic = this.profileFallback;
  }

  private refreshTokenCallback() {
    
  }

  clearAuth() {
    this.loginToken = null;
    this.permissions = [];
  }

  loginThroughTrecApps(login: Login, callable: Function) {

    let observe = {
      next: (response: LoginToken) => { 
        console.log("Response is : {}", response.toString());
          this.loginToken = response;
          console.log("Response of Login Token is : {}", this.loginToken.toString());
          // To-Do: Add Callback
          callable(true);
        
          this.getPermissions();
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
        callable(false);
        if(error?.status == 401 || error ?.status == 403) {
          this.clearAuth();
        }
      }
    };

    this.httpClient.post<LoginToken>(`${environment.resource_url}Auth/login`, login).pipe(take(1)).subscribe(observe);
  }

  getPermissions(){
    let observe = {
      next: (response: string[]) => {
        this.permissions = response;
      }
    }

    this.httpClient.get<string[]>(`${environment.admin_service_url}Permissions`, {headers: this.getHttpHeaders(true, false)}).subscribe(observe);
  }

  getHttpHeaders(useJson: boolean, usingContentType : boolean) : HttpHeaders {
    console.log("Getting Headers!");
    let ret:HttpHeaders = new HttpHeaders();
    ret = ret.append('Authorization', this.getAuthorization());
    ret = ret.append('Accept-Language', this.language);
    if(usingContentType) {
    ret = ret.append('Content-Type', useJson ? 
     'application/json': 'application/x-www-form-urlencoded');
    }
   return ret;
  }

  private updateProfilePic()
  {
   let observe = {
     next: (response: string) => {
       console.log("Response was " + response);
       this.profilePic = `${environment.resource_url}profile/file/${this.currentUser.id}.${response}`;
     },
     error: (error: Response | any) => { 
       alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
       if(error?.status == 401 || error ?.status == 403) {
         this.clearAuth();
       }
     }
   }

   this.httpClient.get(`${environment.resource_url}profile/imageType/${this.currentUser.id}`, {responseType: 'text'}).pipe(take(1)).subscribe(observe);
  }

  async refreshUser() {

    if(!this.loginToken)return;

    let observe = {
      next: (response: TcUser) => { 
        console.info("Birthday Value: ", response.birthday);
        this.currentUser = response;
        this.updateProfilePic();
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
        if(error?.status == 401 || error ?.status == 403) {
          this.clearAuth();
        }
      }
    };

    this.httpClient.get<TcUser>(`${environment.resource_url}profile/Current`,{headers: this.getHttpHeaders(true, false)}).pipe(take(1)).subscribe(observe);
  }

  setAuthorization(loginToken: LoginToken) {
    this.loginToken = loginToken;
  }

  getAuthorization() : string {
    console.log("Auth Token is ", this.loginToken);
    return this.loginToken && this.loginToken.access_token ? this.loginToken.access_token : "";
  }

  logout() {
    if(this.loginToken) {
      this.httpClient.get(`${environment.resource_url}Auth/logout`, {headers: new HttpHeaders().append('Authorization', this.getAuthorization())});
      this.clearAuth();
    }
    this.profilePic = this.profileFallback;
  }
}
