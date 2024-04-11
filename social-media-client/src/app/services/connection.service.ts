import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConnectionEntry, ConnectionRequestTarget, ConnectionStatus, ConnectionType, connectionRequestTargetToStr } from '../models/Connection';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ResponseObj } from '../models/ResponseObj';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  constructor(private authService: AuthService, private client: HttpClient) { }

  getConnectionList(ct: ConnectionRequestTarget) : Observable<ConnectionEntry[]> {

    let params = new HttpParams().append("target", connectionRequestTargetToStr(ct));

    return this.client.get<ConnectionEntry[]>(`${environment.profile_service_url}Connections/list`, {
      headers: this.authService.getHttpHeaders(false, false), params
    })

  }

  getConnectionListByOther(profile: string): Observable<ConnectionStatus[]> {
    let params = new HttpParams().append("profile", profile); 

    return this.client.get<ConnectionStatus[]>(`${environment.profile_service_url}Connections/listByProfile`, {
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
