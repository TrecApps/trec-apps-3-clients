import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BrandInfo, BrandInfoContainer, BrandInfoEntry, BrandReviewEntry, ResourceMetaData } from '../models/Brands';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  updateObserve = {
    error: (error: Response | any) => { 
      alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      if(error?.status == 401 || error ?.status == 403) {
        this.authService.clearAuth();
      }
    }
  }

  submitResource(entry: BrandInfoEntry)
  {
    this.httpClient.post(`${environment.resource_url}Update/submit`, entry, {
      headers: this.authService.getHttpHeaders(true, true),
      responseType: "text"
    }).subscribe(this.updateObserve);
  }

  updateContents(contents: string, id:string, comment: string | undefined)
  {
    let headers = this.authService.getHttpHeaders(false, false).append("Content-Type", "text/plain");
    if(comment){
      headers = headers.append("Comment", comment);
    }

    this.httpClient.post(`${environment.resource_url}Update/contents?resourceId=${id}`, contents, {
      headers,
      responseType: "text"
    }).subscribe(this.updateObserve);
  }

  review(review: BrandReviewEntry) {
    this.httpClient.post(`${environment.resource_url}Update/review`, review, {
      headers: this.authService.getHttpHeaders(true, true),
      responseType: "text"
    }).subscribe(this.updateObserve);
  }

  updateName(change: BrandReviewEntry) {
    this.httpClient.post(`${environment.resource_url}Update/name`, change, {
      headers: this.authService.getHttpHeaders(true, true),
      responseType: "text"
    }).subscribe(this.updateObserve);
  }

  updateMetaData(data: ResourceMetaData, id:string, comment: string | undefined){
    let headers = this.authService.getHttpHeaders(true, true);
    if(comment){
      headers = headers.append("Comment", comment);
    }

    this.httpClient.post(`${environment.resource_url}Update/metadata?resourceId=${id}`, data, {
      headers,
      responseType: "text"
    }).subscribe(this.updateObserve);
  }

  searchByName(name: string, callable: Function, seekAll: boolean) {
    
    let observe = {
      next: (results: BrandInfo[]) => {
        callable(results);
      },
      error : this.updateObserve.error
    };

    this.httpClient.get<BrandInfo[]>(`${environment.resource_url}search/resources/${name.replace(' ', '_').replace('?',"")}${seekAll ? '?all=true' : ""}`,
     {headers:this.authService.getHttpHeaders(true, true)}).subscribe(observe);
  }

  list(callable: Function, all:boolean, page:number, size:number)
  {
    let observe = {
      next: (results: BrandInfo[]) => {
        callable(results);
      },
      error : this.updateObserve.error
    };

    this.httpClient.get<BrandInfo[]>(`${environment.resource_url}search/resourceList?all=${all}&page=${page}&size=${size}`,
    {headers:this.authService.getHttpHeaders(true, true)}).subscribe(observe);

  }

  populateBrand(container: BrandInfoContainer, id:string){
    let observe1 = {
      next: (result: BrandInfo) => {
        container.brandInfo = result;
      },
      error : this.updateObserve.error
    }

    this.httpClient.get<BrandInfo>(`${environment.resource_url}search/resourceEntry/${id}`).subscribe(observe1);

    let observe2 = {
      next: (result: string) => {
        container.contents = result;
      },
      error : this.updateObserve.error
    }
    this.httpClient.get(`${environment.resource_url}search/resourceContent/${id}`, {responseType: 'text'}).subscribe(observe2);

    let observe3 = {
      next: (result: ResourceMetaData) => {
        container.metadata = result;
      },
      error : this.updateObserve.error
    }

    this.httpClient.get<ResourceMetaData>(`${environment.resource_url}search/resourceMetaData/${id}`).subscribe(observe3);
  }

}
