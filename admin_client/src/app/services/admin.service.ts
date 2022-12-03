import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Requester, TcUser } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  imageExt = [
    "apng",
    "avif",
    "gif",
    "jpeg",
    "jpg",
    "png",
    "svg",
    "webp"
  ]

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  async getRequesters(callable:Function)
  {
    let observe = {
      next: (str: string) => {
        this.getRequester(str, callable)
      },
      error: () => {

      }
    }

    this.httpClient.get(`${environment.admin_service_url}Verify/admin/listRequesters`, {headers: this.authService.getHttpHeaders(true, false)}).subscribe(observe);
  }

  getRequester(str:string, callable:Function) {

    let observe = {
      next: (user:TcUser) =>{
        let req = new Requester();
        req.address = user.address;
        req.birthday = user.birthday;
        req.displayName = user.displayName;
        req.id = user.id;
        req.mobilePhone = user.mobilePhone;
        req.username = user.userProfile;

        callable(req);
      }
    }

    this.httpClient.get<TcUser>(`${environment.admin_service_url}Verify/admin/RequesterInfo?userId=${str}`,
    {headers: this.authService.getHttpHeaders(true, false)})
  }

  async updateProfile(req: Requester) {


    let observe = {
      next: (resp: string) => {
        req.profilePic = `${environment.admin_service_url}Verify/RequesterProfile/${req.id}.${resp}`
      }
    }

    this.httpClient.get<string>(`${environment.admin_service_url}Verify/RequesterProfileType`).pipe(take(1)).subscribe(observe);
  }

  async retrieveEvidence(req: Requester) {
    let observe = {
      next: (resp: string) => {
        let type = this.getString(resp);
        if(!type) return;
        this.httpClient.get<ArrayBuffer>(`${environment.admin_service_url}Verify/admin/pic/${resp}`,
         {headers: this.authService.getHttpHeaders(true, false)}).pipe(take(1)).subscribe({
          next: (data: ArrayBuffer) => {
            
            let bData = new Uint8Array(data);
            
            req.verifyPics.push(`${type}${Buffer.from(bData).toString('base64')}`)
          }
         })
      }
    }

    this.httpClient.get<string>(`${environment.admin_service_url}Verify/admin/listPic`, {headers: this.authService.getHttpHeaders(true, false)}).subscribe(observe);
  }

  getString(str:string): string | undefined {
    let lStr = str.toLowerCase();
    for(let e in this.imageExt){
      if(lStr.endsWith(e)){
        return `data:image/${e};base64, `;
      }

    }
  }

  async verifyRequester(userId: string) {
    let observe = {
      next: () => {
        alert("Successfully Submitted");
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    }

    this.httpClient.get(`${environment.admin_service_url}Verify/admin/verify`, {headers: this.authService.getHttpHeaders(true, false)}).subscribe(observe);
  }
}
