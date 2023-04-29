import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ContentUpdate, Falsehood, FalsehoodList, FalsehoodRet, FalsehoodSubmission, ReviewEntry } from '../models/Falsehood';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FalsehoodService {

  updatePath = "/Fact-Update/falsehood";
  searchPath = "/Fact-Search/Falsehood";
  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  updateObserve = {
    error: (error: Response | any) => { 
      //alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      if(error?.status == 401 || error ?.status == 403) {
        this.authService.clearAuth();
      }
    }
  }

  submitFalsehood(falsehoodSubmission:FalsehoodSubmission, onSuccess:Function){
    this.httpClient.post(`${environment.update_url}${this.updatePath}/submit`, falsehoodSubmission, {headers:this.authService.getHttpHeaders(true, true), responseType: "text"}).subscribe({
      next: () => onSuccess(),
      error: this.updateObserve.error
    });
  }

  reviewFalsehood(review:ReviewEntry, action:string, onSuccess:Function) {
    this.httpClient.post(`${environment.update_url}${this.updatePath}/${action}`, review, {headers:this.authService.getHttpHeaders(true, true), responseType: "text"}).subscribe({
      next: () => onSuccess(),
      error: this.updateObserve.error
    });
  }

  updateMetadata(falsehood:Falsehood, comment:string | null, onSuccess:Function){

    let headers = this.authService.getHttpHeaders(true, true);

    if(comment){
      headers = headers.append("Comment", comment);
    }

    this.httpClient.put(`${environment.update_url}${this.updatePath}/metadata`, falsehood, {headers, responseType: 'text'}).subscribe({
      next: () => onSuccess(),
      error: this.updateObserve.error
    })
  }

  updateContents(contentUpdate:ContentUpdate, onSuccess:Function){
    this.httpClient.put(`${environment.update_url}${this.updatePath}/content`, contentUpdate, {headers:this.authService.getHttpHeaders(true, true), responseType: "text"}).subscribe({
      next: () => onSuccess(),
      error: this.updateObserve.error
    })
  }

  searchFalsehoodsByTags(term: string, useCommonTag: boolean, usePage: number, useSize: number, results: Function){
    this.httpClient.get<FalsehoodList>(`${environment.search_url}${this.searchPath}/${useCommonTag ? 'ByCommonTags' : 'ByUncommonTags'}?term=${term}&page=${usePage}&size=${useSize}`).subscribe({
      next: (result: FalsehoodList) => results(result)
    })
  }

  searchFalsehoodsByProperties(falsehood:Falsehood,  usePage: number, useSize: number, results:Function){
    let body = {
      falsehood,
      page: usePage,
      size: useSize
    }
    this.httpClient.post<FalsehoodList>(`${environment.search_url}${this.searchPath}/fields`,body).subscribe({
      next: (result: FalsehoodList) => results(result)
    })
  }


  retrieveFalsehood(id:string, onSuccess: Function){
    this.httpClient.get<FalsehoodRet>(`${environment.search_url}${this.searchPath}/id/${id}`).subscribe({
      next: (result: FalsehoodRet) => onSuccess(result)
    })
  }
}
