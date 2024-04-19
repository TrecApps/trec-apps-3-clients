import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Block, BlockRequest } from '../models/Block';
import { environment } from '../environments/environment';
import { ResponseObj } from '../models/ResponseObj';

@Injectable({
  providedIn: 'root'
})
export class BlockService {

  constructor(private authService: AuthService, private client: HttpClient) { }

  getBlockedList(): Observable<Block[]> {
    return this.client.get<Block[]>(`${environment.profile_service_url}Blocks`, {headers: this.authService.getHttpHeaders(false,false)});
  }

  blockPerson(profileId: string, onlyCurrentApp: boolean): Observable<ResponseObj> {

    let profSplit = profileId.split("-");
    if(profSplit[0].startsWith("Brand")){
      alert("Not yet implementing blocking Brand Accounts");
      ;
    }

    

    return this.client.post<ResponseObj>(`${environment.profile_service_url}Blocks`, new BlockRequest(profSplit[1], onlyCurrentApp), {
      headers: this.authService.getHttpHeaders(true, true)
    })
  }
}
