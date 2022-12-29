import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Requester, TcUser } from '../models/user';
import { AuthService } from './auth.service';


class DoubleFileType{
  extType: string;
  fullType: string;
}

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
      next: (str: string[]) => {
        console.log("Responding to Users!", str.length);
        for(let strId of str){
          this.getRequester(strId, callable)
        }
      },
      error: (error: any) => {

        if(error?.status == 401 || error ?.status == 403) {
          this.authService.clearAuth();
        }
      }
    }

    this.httpClient.get<string[]>(`${environment.admin_service_url}Verify/admin/listRequesters`, {headers: this.authService.getHttpHeaders(true, true)}).subscribe(observe);
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
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
        if(error?.status == 401 || error ?.status == 403) {
          this.authService.clearAuth();
        }
      }
    }

    this.httpClient.get<TcUser>(`${environment.admin_service_url}Verify/admin/RequesterInfo?userId=${str}`,
    {headers: this.authService.getHttpHeaders(true, false)}).pipe(take(1)).subscribe(observe);
  }

  async updateProfile(req: Requester) {


    let observe = {
      next: (resp: string) => {
        req.profilePic = `${environment.admin_service_url}Verify/RequesterProfile/${req.id}.${resp}`
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
        if(error?.status == 401 || error ?.status == 403) {
          this.authService.clearAuth();
        }
      }
    }

    this.httpClient.get<string>(`${environment.admin_service_url}Verify/RequesterProfileType`).pipe(take(1)).subscribe(observe);
  }

  async retrieveEvidence(req: Requester) {
    let observe = {
      next: (respList: string[]) => {

        for(let resp of respList)
        {
          let type = this.getString(resp);
          if(!type) return;

          let headers = this.authService.getHttpHeaders(true, false);
          headers = headers.append("Accept", `image/${type.extType}`);

          this.httpClient.request('GET', `${environment.admin_service_url}Verify/admin/pic/${resp}`, 
          {headers: headers, responseType: 'arraybuffer'}).pipe(take(1)).subscribe({
            next: (data: ArrayBuffer) => {
            
              let bData = new Uint8Array(data);
              
              req.verifyPics.push(`${type.fullType}${Buffer.from(bData).toString('base64')}`)
          }
         });
        }
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
        if(error?.status == 401 || error ?.status == 403) {
          this.authService.clearAuth();
        }
      }
    }

    this.httpClient.get<string[]>(`${environment.admin_service_url}Verify/admin/listPic?userId=${req.id}`, {headers: this.authService.getHttpHeaders(true, false)}).subscribe(observe);
  }

  getString(str:string): DoubleFileType | undefined {
    let lStr = str.toLowerCase();
    for(let e of this.imageExt){
      if(lStr.endsWith(e)){
        return {fullType:`data:image/${e};base64, `, extType: e};
      }

    }
    console.log("Returning Undefined for " + lStr);
  }

  async verifyRequester(userId: string) {
    let observe = {
      next: () => {
        alert("Successfully Submitted");
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
        if(error?.status == 401 || error ?.status == 403) {
          this.authService.clearAuth();
        }
      }
    }

    this.httpClient.get(`${environment.admin_service_url}Verify/admin/verify?userId=${userId}`, {headers: this.authService.getHttpHeaders(true, false)}).subscribe(observe);
  }
}
