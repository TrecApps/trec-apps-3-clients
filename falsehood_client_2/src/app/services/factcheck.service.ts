import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { FactCheckList, FactCheckRet, FactcheckSubmission, FactcheckUpdate, ReviewEntry } from '../models/Falsehood';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FactcheckService {

  updatePath = "/Fact-Update/fact-check";
  searchPath = "/Fact-Search/FactCheck";
  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  updateObserve = {
    error: (error: Response | any) => { 
      //alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      if(error?.status == 401 || error ?.status == 403) {
        this.authService.clearAuth();
      }
    }
  }

  submitFactCheck(factcheck: FactcheckSubmission, onSuccess:Function){
    this.httpClient.post(`${environment.update_url}${this.updatePath}/submit`, factcheck, {headers:this.authService.getHttpHeaders(true, true), responseType: "text"}).subscribe({
      next: () => onSuccess(),
      error: this.updateObserve.error
    });

   
  }

  reviewFactcheck(reviewEntry: ReviewEntry, approve:Boolean, onSuccess: Function){
    this.httpClient.post(`${environment.update_url}${this.updatePath}/${approve ? 'Approve' : 'Reject'}`,
      reviewEntry, {headers:this.authService.getHttpHeaders(true, true), responseType: "text"}).subscribe({
        next: () => onSuccess(),
        error: this.updateObserve.error
      })
  }

  updateFactcheck(update: FactcheckUpdate, onSuccess: Function){
    this.httpClient.put(`${environment.update_url}${this.updatePath}/update`, update, 
    {headers:this.authService.getHttpHeaders(true, true), responseType: "text"}).subscribe({
      next: () => onSuccess(),
      error: this.updateObserve.error
    });
  }

  searchFactchecksByTags(term: string, useCommonTag: boolean, usePage: number, useSize: number, results: Function){
    this.httpClient.get<FactCheckList>(`${environment.search_url}${this.searchPath}/${useCommonTag ? 'ByCommonTags' : 'ByUncommonTags'}?term=${term}&page=${usePage}&size=${useSize}`).subscribe({
      next: (result: FactCheckList) => results(result)
    })
  }

  searchFactchecksByTitle(term: string, usePage: number, useSize: number, results: Function){
    this.httpClient.get<FactCheckList>(`${environment.search_url}${this.searchPath}/ByTitle?name=${term}&page=${usePage}&size=${useSize}`).subscribe({
      next: (result: FactCheckList) => results(result)
    })
  }

  retrieveFactCheck(id:string, onSuccess: Function){
    this.httpClient.get<FactCheckRet>(`${environment.search_url}${this.searchPath}/id/${id}`).subscribe({
      next: (result: FactCheckRet) => onSuccess(result)
    })
  }
}
