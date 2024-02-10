import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Profile, ProfileCreateBody, PropertyTreeNode } from '../models/ProfileObjs';
import { environment } from '../environments/environment';
import { CommentPost } from '../models/posts';
import { Observable } from 'rxjs';
import { ResponseObj } from '../models/ResponseObj';
import { BrandInfo } from '../models/BrandInfo';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  id: String = "";
  coverPhoto: String = "assets/scaffolds/Part_3_Ch_18.png";
  profilePhoto: String = "assets/scaffolds/Profile_JLJ.png";

  pronouns: string[] = [];

  propertyNodes: PropertyTreeNode |undefined;

  constructor(private authService: AuthService, private client: HttpClient) {
    this.client = client;
    this.refreshPropertyTreeNode();
  }

  setCoverPhoto(data: String){
    this.coverPhoto = data;
  }

  setProfilePhoto(data: String){
    this.profilePhoto = data;
  }
  
  getProfile(id: String): Observable<Profile> {
    let url = `${environment.profile_service_url}Profile/by/${id}`;

    let headers = this.authService.getHttpHeaders(false, false);

    return this.client.get<Profile>(url, {headers});
  }

  establishProfile(body: ProfileCreateBody): Observable<Profile> {
    return this.client.post<Profile>(`${environment.profile_service_url}Profile`, body, {
      headers: this.authService.getHttpHeaders(true, true)
    });
  }

  refreshPropertyTreeNode(){
    // if(this.propertyNodes) return;

    // this.client.get<PropertyTreeNode>(`${environment.profile_service_url}Profile/detailsMap`).subscribe({
    //   next: (value: PropertyTreeNode) => {
    //     this.propertyNodes = value;
    //   }
    // });

    // this.client.get<string[]>(`${environment.profile_service_url}Profile/pronouns`).subscribe({
    //   next: (value: string[]) => {
    //     this.pronouns = value;
    //   }
    // });
  }

  updateAboutMe(newAboutMe: String): Observable<ResponseObj> {
    let headers = this.authService.getHttpHeaders(false,false).append('Content-Type', 'text/plain');

    return this.client.put<ResponseObj>(`${environment.profile_service_url}Profile/AboutMe`, newAboutMe, { headers});
  }

  updateMovies(movies: BrandInfo[]): Observable<ResponseObj> {
    return this.client.put<ResponseObj>(`${environment.profile_service_url}Profile/Movies`, movies, {
      headers: this.authService.getHttpHeaders(true, true)
    });
  }

  updateSongs(movies: BrandInfo[]): Observable<ResponseObj> {
    return this.client.put<ResponseObj>(`${environment.profile_service_url}Profile/Songs`, movies, {
      headers: this.authService.getHttpHeaders(true, true)
    });
  }

  updateBooks(movies: BrandInfo[]): Observable<ResponseObj> {
    return this.client.put<ResponseObj>(`${environment.profile_service_url}Profile/Books`, movies, {
      headers: this.authService.getHttpHeaders(true, true)
    });
  }

}
