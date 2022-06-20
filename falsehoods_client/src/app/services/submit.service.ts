import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { FullMediaFalsehood } from '../models/media.falsehood';
import { StringWrapper } from '../../../../angular_common/Models/Common';
import { FullPublicFalsehood } from '../models/public.falsehood';

@Injectable({
  providedIn: 'root'
})
export class SubmitService {

  baseUrl: string;

  constructor(private httpClient: HttpClient, private authService: AuthService) {
    this.baseUrl = environment.falsehood_submit_url;
   }

   getHttpHeaders(useJson: boolean) : HttpHeaders {
     let ret:HttpHeaders = new HttpHeaders();
     ret = ret.append('Authorization', this.authService.getAuthorization());
     ret = ret.append('Content-Type', useJson ? 
      'application/json': 'application/x-www-form-urlencoded');
    return ret;
   }

   SubmitMediaEntry(entry: FullMediaFalsehood, ret: StringWrapper) {
    let observe = {
      next: (response: Object) => { ret.content = response.toString();},
      error: (error: Response | any) => { 
        ret.content = (error instanceof Response) ? error.text : (error.message ? error.message : error.toString());
      }
    };

    this.httpClient.post(`${this.baseUrl}/Update/Media/Submit`,
    entry, {headers: this.getHttpHeaders(true)}).pipe(take(1)).subscribe(observe);
   }

   SubmitPublicEntry(entry: FullPublicFalsehood, ret: StringWrapper) {
    let observe = {
      next: (response: Object) => { ret.content = response.toString();},
      error: (error: Response | any) => { 
        ret.content = (error instanceof Response) ? error.text : (error.message ? error.message : error.toString());
      }
    };

    this.httpClient.post(`${this.baseUrl}/Update/Public/Submit`,
    entry, {headers: this.getHttpHeaders(true)}).pipe(take(1)).subscribe(observe);
   }

   
   UpdateMediaMetadata(entry: FullMediaFalsehood, ret: StringWrapper) {
    let observe = {
      next: (response: Object) => { ret.content = response.toString();},
      error: (error: Response | any) => { 
        ret.content = (error instanceof Response) ? error.text : (error.message ? error.message : error.toString());
      }
    };

    this.httpClient.post(`${this.baseUrl}/Update/Media/Metadata`,
    entry, {headers: this.getHttpHeaders(true)}).pipe(take(1)).subscribe(observe);
   }

   UpdatePublicMetadata(entry: FullPublicFalsehood, ret: StringWrapper) {
    let observe = {
      next: (response: Object) => { ret.content = response.toString();},
      error: (error: Response | any) => { 
        ret.content = (error instanceof Response) ? error.text : (error.message ? error.message : error.toString());
      }
    };

    this.httpClient.post(`${this.baseUrl}/Update/Public/Metadata`,
    entry, {headers: this.getHttpHeaders(true)}).pipe(take(1)).subscribe(observe);
   }
   
   UpdateMediaContents(entry: FullMediaFalsehood, ret: StringWrapper) {
    let observe = {
      next: (response: Object) => { ret.content = response.toString();},
      error: (error: Response | any) => { 
        ret.content = (error instanceof Response) ? error.text : (error.message ? error.message : error.toString());
      }
    };

    this.httpClient.post(`${this.baseUrl}/Update/Media/Content`,
    entry, {headers: this.getHttpHeaders(false)}).pipe(take(1)).subscribe(observe);
   }

   UpdatePublicContents(entry: FormData, ret: StringWrapper) {
    let observe = {
      next: (response: Object) => { ret.content = response.toString();},
      error: (error: Response | any) => { 
        ret.content = (error instanceof Response) ? error.text : (error.message ? error.message : error.toString());
      }
    };

    this.httpClient.post(`${this.baseUrl}/Update/Public/Content`,
    entry, {headers: this.getHttpHeaders(false)}).pipe(take(1)).subscribe(observe);
   }
   
}
