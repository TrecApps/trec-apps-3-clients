import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Login, LoginTokin } from '../../../../angular_common/Models/Login'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginInfo!: LoginTokin;

  constructor(private httpClient: HttpClient,private authService: MsalService){

  }

  GetAuthorization() : string {
    return this.loginInfo ? this.loginInfo.access_token : "";
  }

  async loginViaTrecApps(username: string, password: string): Promise<string> {
    if(username.length == 0 || password.length < 8) {
      return "Needs valid Username and Password of at least 8 characters";
    }
    if(!username.endsWith(environment.falsehood_user_string)) {
      username += environment.falsehood_user_string;
    }

    let ret = "";

    let observe = {
      next: (response: LoginTokin | Object) => {
        if(response instanceof LoginTokin) {
          this.loginInfo = response;
        }
      },
      error: (error: Response | any) => { 
        ret = (error instanceof Response) ? error.text : (error.message ? error.message : error.toString());
      }
    }

    this.httpClient.post(`${environment.falsehood_user_url}/Auth/login`, new Login(username, password)).
      pipe(take(1)).subscribe(observe);


    return ret;

  } 

  async loginViaMicrosoft() {
    this.authService.loginPopup()
      .subscribe({
        next: (result) => {
          console.log(result);
          //AuthenticationResult;
        },
        error: (error) => console.log(error)
      });
  }
}
