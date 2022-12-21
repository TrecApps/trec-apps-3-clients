import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  profileFallback = "/assets/Unknown_Profile.png";
  profilePic: String;


  verificationStatus: number = -2;


  constructor(private httpClient: HttpClient, private authService: AuthService, private router: Router) {
    this.currentUser = new TcUser();
    this.profilePic = this.profileFallback;
   }

   requestEmailVerification() {

    let error = (error: Response | any) => { 
      alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
    }

    let observe = {
      next: (response: Object) => { 
        let code = prompt(`Check your Email ${this.currentUser.email} for a Code from TrecApps and enter it here (within ten minutes):`);

        this.httpClient.post(`${environment.user_service_url}Email`, code,
         {headers: this.authService.getHttpHeaders(true, false)}).pipe(take(1)).subscribe({
          error,
          next: () => {
            this.currentUser.emailVerified = true;
          }
         })
      },
      error
    }


    this.httpClient.get(`${environment.user_service_url}Email`,
     {headers: this.authService.getHttpHeaders(true, false)}).pipe(take(1)).subscribe(observe);
   }

   private updateProfilePic()
   {
    let observe = {
      next: (response: string) => {
        console.log("Response was " + response);
        this.profilePic = `${environment.user_service_url}profile/file/${this.currentUser.id}.${response}`;
      }
    }

    this.httpClient.get(`${environment.user_service_url}profile/imageType/${this.currentUser.id}`, {responseType: 'text'}).pipe(take(1)).subscribe(observe);
   }

   requestProfileVerification() {
    let observe = {
      next: (response: string) => {
        console.log("Response was " + response);
        this.verificationStatus = 0;
      },
      error: (error: Response | any) => {
        if(error.status && error.status == 409) {
          this.verificationStatus = 0;
          alert("You already have a Verification Request in Place");
        }
      }
    }


    this.httpClient.get<string>(`${environment.user_admin_url}Verify/requestVerification`,{headers: this.authService.getHttpHeaders(true, false)})
      .pipe(take(1)).subscribe(observe);
   }

   checkAuthClear(error: Response | any) {
    if(error.status && (error.status == 401 || error.status == 403)) {
      this.authService.clearAuth();
      this.currentUser = new TcUser();
      this.profilePic = this.profileFallback;
    }
   }

  async refreshUser(ref: BooleanRef, callable: Function) {
    let observe = {
      next: (response: TcUser) => { 
        console.info("Birthday Value: ", response.birthday);
        this.currentUser = response;
        this.updateProfilePic();
        ref.value = true;
        callable();
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    };

    this.httpClient.get<TcUser>(`${environment.user_service_url}Users/Current`,{headers: this.authService.getHttpHeaders(true, false)}).pipe(take(1)).subscribe(observe);
    this.refreshAdminVerificationStatus();
  }

  async refreshAdminVerificationStatus()
  {
    let observeError = (error: Response | any) => { 
      alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
    };
    let observe2 = {
      next: (response: Boolean) => {
        this.verificationStatus = response ? -1 : 0;
      },
      error: observeError
    }

    let observe1 = {
      next: (response: Boolean) => {
        if(response){
          this.verificationStatus = 1;
        } else {
          this.httpClient.get<Boolean>(`${environment.user_admin_url}Verify/hasVerification`,{headers: this.authService.getHttpHeaders(true, false)})
          .pipe(take(1)).subscribe(observe2);
        }
      },
      error: observeError
    }

    this.httpClient.get<Boolean>(`${environment.user_admin_url}Verify/isVerified`,{headers: this.authService.getHttpHeaders(true, false)})
    .pipe(take(1)).subscribe(observe1);
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

  async changeProfilePic(data:string, ext:string)
  {
    let header = this.authService.getHttpHeaders(true, false).append("Content-Type", `image/${ext}`);
    let observe = {
      next: () =>{
        this.updateProfilePic();
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    }

    this.httpClient.post(`${environment.user_service_url}profile/set`, data,{headers: header}).pipe(take(1)).subscribe(observe);
  }

  async uploadVerificationPic(data:string, ext:string)
  {
    let header = this.authService.getHttpHeaders(true, false).append("Content-Type", `image/${ext}`);
    let observe = {
      next: () =>{
        alert("Successfully Uploaded!");
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    }

    this.httpClient.post(`${environment.user_admin_url}Verify/AddEvidence`, data,{headers: header}).pipe(take(1)).subscribe(observe);
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
