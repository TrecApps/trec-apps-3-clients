import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConnectionEntry, ConnectionType } from '../models/Connection';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ResponseObj } from '../models/ResponseObj';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  constructor(private authService: AuthService, private client: HttpClient) { }

  getConnectionList(ct: ConnectionType) : Observable<ConnectionEntry[]> {

    let params = new HttpParams().append("target", ct);

    return this.client.get<ConnectionEntry[]>(`${environment.profile_service_url}Connections/list`, {
      headers: this.authService.getHttpHeaders(false, false), params
    })

  }

  makeConnectionRequest(profileId: string): Observable<ResponseObj> {

    let params = new HttpParams().append("profile", profileId);

    return this.client.get<ResponseObj>(`${environment.profile_service_url}Connections/makeRequest`, {
      headers: this.authService.getHttpHeaders(false, false), params
    })

  }

  makeConnectionResponse(profileId: string, confirming: boolean): Observable<ResponseObj> {

    let params = new HttpParams().append("profile", profileId);

    return this.client.get<ResponseObj>(`${environment.profile_service_url}Connections/Respond/${confirming}`, {
      headers: this.authService.getHttpHeaders(false, false), params
    })

  }

  follow(profileId: string): Observable<ResponseObj> {

    let params = new HttpParams().append("profile", profileId);

    return this.client.get<ResponseObj>(`${environment.profile_service_url}Connections/Follow`, {
      headers: this.authService.getHttpHeaders(false, false), params
    })

  }

  removeConnection(id: number){
    let params = new HttpParams().append("id", id);

    return this.client.delete<ResponseObj>(`${environment.profile_service_url}Connections`, {
      headers: this.authService.getHttpHeaders(false, false), params
    })
  }

}
