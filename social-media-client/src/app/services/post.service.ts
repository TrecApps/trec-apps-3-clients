import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AddPost, Post } from '../models/posts';
import { ResponseObj } from '../models/ResponseObj';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {


  categoryList: string[] = [];

  constructor(private authService: AuthService, private client: HttpClient) { 

    let observe = {
      next: (list: string[]) => {
        this.categoryList = list;
      }
    }

    this.client.get<string[]>(`${environment.post_service_url}Posts/CategoryList`).subscribe(observe);

  }



  // Edit Methods

  persistPost(post: AddPost): Observable<ResponseObj> {

    if(post.id) {
      // We are persisting an exiting post, call the put api
      return this.client.put<ResponseObj>(`${environment.post_service_url}PostEdit`, post, {headers: this.authService.getHttpHeaders(true, true)})
    } else {
      // We are creating a new Post
      return this.client.post<ResponseObj>(`${environment.post_service_url}PostEdit`, post, {headers: this.authService.getHttpHeaders(true, true)})
    }
    
  }

  deletePost(id: string): Observable<ResponseObj> {
    return this.client.delete<ResponseObj>(`${environment.post_service_url}PostEdit`, {
      headers: this.authService.getHttpHeaders(true, true),
      params: new HttpParams().append("id", id)
    });
  }

  // Get Methods

  getByUser(id:string, page: number, size: number): Observable<Post[]> {
    return this.client.get<Post[]>(`${environment.post_service_url}Posts/byUser`, {
      headers: this.authService.getHttpHeaders(true, true),
      params: new HttpParams().append("userId", id).append("page", page).append("size", size)
    });
  }
  
  getByBrand(id:string, page: number, size: number): Observable<Post[]> {
    return this.client.get<Post[]>(`${environment.post_service_url}Posts/byBrand`, {
      headers: this.authService.getHttpHeaders(true, true),
      params: new HttpParams().append("brandId", id).append("page", page).append("size", size)
    });
  }

  getByModule(id:string, page: number, size: number, sort?: string): Observable<Post[]> {

    let params = new HttpParams().append("moduleId", id).append("page", page).append("size", size);

    if(sort){
      params = params.append("sort", sort);
    }

    return this.client.get<Post[]>(`${environment.post_service_url}Posts/byModule`, {
      headers: this.authService.getHttpHeaders(true, true),
      params 
    });
  }

  getPost(id: string): Observable<Post> {
    return this.client.get<Post>(`${environment.post_service_url}Posts/byId/${id}`, {
      headers: this.authService.getHttpHeaders(true, true)
    });
  }

}
