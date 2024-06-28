import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { PostFilter, PostFilterRequest, ProfilePostFilters, ProfileSel, SocialMediaEventList } from '../models/ProfileObjs';
import { environment } from '../environments/environment';
import { ResponseObj } from '../models/ResponseObj';

@Injectable({
  providedIn: 'root'
})
export class ProfileDetailsService {

  profiles: Map<string, string> = new Map<string, string>();

  pageSize: number = 50;

  filters: ProfilePostFilters = new ProfilePostFilters();

  getProfile(id: string, onProfile: Function){
    if(this.profiles.has(id)){
      onProfile(this.profiles.get(id));
    } else {
      this.getBasicProfile(id).subscribe({
        next: (prof: ProfileSel) => {
          this.profiles.set(prof.id, prof.name);
          onProfile(this.profiles.get(id));
        },
        error: ()=> {
          onProfile(undefined);
        }
      })
    }
  }

  getBasicProfile(id: string): Observable<ProfileSel> {
    return this.client.get<ProfileSel>(`${environment.profile_service_url}Profile/basic/${id}`, {
      headers: this.authService.getHttpHeaders(false, false)
    });
  }

  getPageSize() {
    this.client.get(`${environment.profile_service_url}Home/pageSize`, {
      headers: this.authService.getHttpHeaders(false, false),
      responseType: "text"
    }).subscribe({
      next: (value: string) => {
        this.pageSize = parseInt(value)
      }
    })
  }

  constructor(private authService: AuthService, private client: HttpClient) { 
    this.getPageSize();
  }

  initializeHomePageContent(): Observable<SocialMediaEventList> {
    return this.client.get<SocialMediaEventList>(`${environment.profile_service_url}Home/latest`, {headers: this.authService.getHttpHeaders(false, false)})
  }

  getMoreContent(currentList: SocialMediaEventList): Observable<SocialMediaEventList> {
    let beginning = currentList.earlyBounds - 10;
    if(currentList.earlyBounds == 0){
      if(currentList.page == 0){
        return of(new SocialMediaEventList(0,0,0, []));
      } else {
        currentList.page--;
        beginning = this.pageSize - 10;
      }
    }

    let params = new HttpParams().append("page", currentList.page).append("pageLoc", Math.max(0, beginning))

    return this.client.get<SocialMediaEventList>(`${environment.profile_service_url}Home/section`, {headers: this.authService.getHttpHeaders(false, false), params});
  }


  updateFilters(){
    this.client.get<ProfilePostFilters>(`${environment.profile_service_url}Home/filters`, {
      headers: this.authService.getHttpHeaders(false, false)
    }).subscribe({
      next: (value: ProfilePostFilters) => this.filters = value
    })
  }

  uploadFilter(filter: PostFilterRequest): Observable<ResponseObj> {
    return this.client.post<ResponseObj>(`${environment.profile_service_url}Home/filters`, filter, {
      headers: this.authService.getHttpHeaders(true, true)
    })
  }

  removeFilter(filter: PostFilter) : Observable<ResponseObj> {
    return this.client.delete<ResponseObj>(`${environment.profile_service_url}Home/filters`, {
      headers: this.authService.getHttpHeaders(true, true),
      body: filter
    })
  }

}
