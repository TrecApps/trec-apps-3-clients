import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReactionStats, ResponseObj } from '../models/ResponseObj';
import { ReactionComment, ReactionPost } from '../models/Reaction';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {

  constructor(private client: HttpClient, private authService: AuthService) { }

  makeReactionOnPost(postId: string, type: string,isPositive: boolean, isPrivate: boolean, reactionId: number | undefined): Observable<ResponseObj> {
    let reactionPost = new ReactionPost(isPositive, type, postId);
    reactionPost.isPrivate = isPrivate;
    reactionPost.id = reactionId;
    
    return this.client.post<ResponseObj>(`${environment.post_service_url}PostReact`, reactionPost, {
      headers: this.authService.getHttpHeaders(true, true)
    })
  }

  removeReactionOnPost(id: number): Observable<ResponseObj>{
    let params = new HttpParams().append("reactionId", id);

    return this.client.delete<ResponseObj>(`${environment.post_service_url}PostReact`, {
      headers: this.authService.getHttpHeaders(false, false),
      params
    })
  }

  getReactionCountByPost(id: string): Observable<ReactionStats> {
    let params = new HttpParams().append("id", id);
    return this.client.get<ReactionStats>(`${environment.post_service_url}PostReact/CountByPost`, {
      headers: this.authService.getHttpHeaders(false, false),
      params
    })
  }


  makeReactionOnComment(commentId: string, type: string,isPositive: boolean, isPrivate: boolean, reactionId: number | undefined): Observable<ResponseObj> {
    let reactionPost = new ReactionComment(isPositive, type, commentId);
    reactionPost.isPrivate = isPrivate;
    reactionPost.id = reactionId;
    
    return this.client.post<ResponseObj>(`${environment.comment_service_url}CommentReact`, reactionPost, {
      headers: this.authService.getHttpHeaders(true, true)
    })
  }

  removeReactionOnComment(id: number): Observable<ResponseObj>{
    let params = new HttpParams().append("reactionId", id);

    return this.client.delete<ResponseObj>(`${environment.comment_service_url}CommentReact`, {
      headers: this.authService.getHttpHeaders(false, false),
      params
    })
  }

  getReactionCountByComment(id: string): Observable<ReactionStats> {
    let params = new HttpParams().append("id", id);
    return this.client.get<ReactionStats>(`${environment.comment_service_url}CommentReact/CountByComment`, {
      headers: this.authService.getHttpHeaders(false, false),
      params
    })
  }
}
