import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Comment, CommentPost } from '../models/posts';
import { ResponseObj } from '../models/ResponseObj';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private authService: AuthService, private client: HttpClient) { }

  postComment(commentPost: CommentPost): Observable<ResponseObj> {
    return this.client.post<ResponseObj>(`${environment.comment_service_url}CommentEdit`, commentPost, {
      headers: this.authService.getHttpHeaders(true, true)
    });
  }

  editComment(commentPost: CommentPost, commentId: string): Observable<ResponseObj> {
    let params = new HttpParams().append("id", commentId);
    return this.client.put<ResponseObj>(`${environment.comment_service_url}CommentEdit`, commentPost, {
      headers: this.authService.getHttpHeaders(true, true), params
    });
  }

  deleteComment(commentId: string): Observable<ResponseObj> {
    let params = new HttpParams().append("id", commentId);
    return this.client.delete<ResponseObj>(`${environment.comment_service_url}CommentEdit`, {
      headers: this.authService.getHttpHeaders(true, true), params
    });
  }

  ///
  /// Get Methods
  ///

  getById(id: string): Observable<Comment> {
    return this.client.get<Comment>(`${environment.comment_service_url}get_comment/get/${id}`, {
      headers: this.authService.getHttpHeaders(false, false)
    })
  }

  getCommentsByPost(postId: string, size: number, page: number, sortBy: string = "null", desc: boolean = true): Observable<Comment[]> {
    let params = new HttpParams().append("size", size).append("page", page).append("sortBy", sortBy).append("desc", desc);
    return this.client.get<Comment[]>(`${environment.comment_service_url}get_comment/getByPost/${postId}`, {
      headers: this.authService.getHttpHeaders(false, false), params
    })
  }

  getCommentsByParent(postId: string, size: number, page: number): Observable<Comment[]> {
    let params = new HttpParams().append("size", size).append("page", page);
    return this.client.get<Comment[]>(`${environment.comment_service_url}get_comment/getByParent/${postId}`, {
      headers: this.authService.getHttpHeaders(false, false), params
    })
  }
}
