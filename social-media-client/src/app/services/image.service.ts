import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImageEntry, ImageMetaRes } from '../models/Image';
import { environment } from '../environments/environment';
import { ResponseObj } from '../models/ResponseObj';
import { Router } from '@angular/router';

export class ImageMetaChecker{
  counter: number;
  imageId: String;

  onSuccess: Function;
  onFailure: Function;

  id: number = 0;

  constructor(private imageService: ImageService, counter: number, imageId: String, onSuccess: Function, onFailure:Function) {
    this.counter = counter;
    this.imageId = imageId;
    this.onSuccess = onSuccess;
    this.onFailure = onFailure;
  }

  prepareCall(){
    setTimeout((checker: ImageMetaChecker) => {
      checker.performCall();
    }, 3000, this);
  }

  performCall(){
    this.imageService.seekMetaData(this.imageId).subscribe({
      next: (result: ImageMetaRes) => {
        if(result.meta?.extraDetails){
          this.onSuccess(result.meta, this.imageId);
        } else if(this.counter < 0){
          this.onFailure("Could not Process Image in time", this.imageId)
        } else {
          this.counter--;
          console.log("Check Counter is now ", this.counter);
          this.prepareCall();
        }
      },
      error: (result: ImageMetaRes | Response) => {
        if(result instanceof ImageMetaRes){
          this.onFailure(result.message, this.imageId);
        }
        else {
          this.onFailure("Unknown Error Occured");
        }
      }
    })
  }

  start(){
    this.prepareCall();
  }
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private authService: AuthService, private client: HttpClient, private router: Router) { }

  seekEntriesByOwner(page: number, size: number): Observable<ImageEntry[]> {

    let params = new HttpParams().append("page", page).append("size", size);

    return this.client.get<ImageEntry[]>(`${environment.image_service_url}ImageRetrieval/byOwner`, {
      headers: this.authService.getHttpHeaders(false, false), params});

  }

  seekMetaData(id: String): Observable<ImageMetaRes> {
    return this.client.get<ImageMetaRes>(`${environment.image_service_url}ImageRetrieval/meta/${id}`, {
      headers: this.authService.getHttpHeaders(true, true)});
  }

  getMetaChecker(id: String, onSuccess: Function, onFailure:Function ) : ImageMetaChecker {
    return new ImageMetaChecker(this, 10, id, onSuccess, onFailure);
  }

  retrieveImageBase64(id:String): Observable<ResponseObj> {
    return this.client.get<ResponseObj>(`${environment.image_service_url}ImageRetrieval/byBase64/${id}`, {
      headers: this.authService.getHttpHeaders(true, true)})
  }

  postImage(data: String, ext: String, handler: Function, name: String | undefined){
    let params = `?app=${environment.app_name}`;

    if(name){
      params += `&name=${name}`;
    }

    
    let header = this.authService.getHttpHeaders(true, false).append("Content-Type", `image/${ext}`);

    let observe = {
      next: (obj: ResponseObj) =>{
        handler(true, obj.id);
      },
      error: (error: ResponseObj | any) => { 
        handler(false, error.message);
        if(error instanceof Response && ( error?.status == 401 || error?.status == 403)){
          this.authService.clearAuth();
          this.router.navigate(['logon']);
        }
      }
    }
    console.log(`Sending ${data.slice(0, 20)} as image/${ext} to ${environment.image_service_url}ImageEdit/post${params}`);

    this.client.post<ResponseObj>(`${environment.image_service_url}ImageEdit/post${params}`, data, {headers: header}).subscribe(observe);
  }

  setProfile(id: String, isBrand: boolean){
    let endpoint = isBrand ? "SetBrand" : "Set";

    let url = `${environment.image_service_url}Profile/${endpoint}`;

    let params = new HttpParams().append("pictureId", id.toString()).append("app", environment.app_name);
    let headers = this.authService.getHttpHeaders(false, false);

    return this.client.put<ResponseObj>(url, undefined, {
      headers, params
    });
  }



  setCoverPhoto(id: String, isBrand: boolean){
    let endpoint = isBrand ? "SetBrand" : "Set";

    let url = `${environment.image_service_url}Profile/${endpoint}`;

    let params = new HttpParams().append("pictureId", id.toString()).append("app", `cover-${environment.app_name}`);
    let headers = this.authService.getHttpHeaders(false, false);

    return this.client.put<ResponseObj>(url, undefined, {
      headers, params
    });
  }

}
