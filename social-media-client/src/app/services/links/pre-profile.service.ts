import { Injectable } from '@angular/core';
import { ProfileCreateBody } from '../../models/ProfileObjs';

@Injectable({
  providedIn: 'root'
})
export class PreProfileService {

  constructor() { }

  aboutMe: String = "";
  pronouns: String = "";
  displayName: String = "";
  coverImage: String = "";

  pronounList: string[] = [];

  setPronounsList(pl: string[]){ this.pronounList = pl; }

  setDisplayName(dn: String){ this.displayName = dn; }
  setCoverImage(ci: String){ this.coverImage = ci; }

  prepRequest(requestBody: ProfileCreateBody){
    requestBody.aboutMe = this.aboutMe;
    requestBody.coverImage = this.coverImage;
    requestBody.displayName = this.displayName;
    requestBody.pronouns = this.pronouns;
  }
}
