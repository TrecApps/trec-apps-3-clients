import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginTokin } from '../../../../angular_common/Models/Login'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginInfo!: LoginTokin;

  constructor(private httpClient: HttpClient){

  }

  GetAuthorization() : string {
    return this.loginInfo ? this.loginInfo.access_token : "";
  }
}
