import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { PropertyTreeNode } from '../models/ProfileObjs';
import { environment } from '../environments/environment';

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

}
