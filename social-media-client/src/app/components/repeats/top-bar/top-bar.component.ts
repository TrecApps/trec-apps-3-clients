import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ProfileSel } from '../../../models/ProfileObjs';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css',
  animations: [
    trigger('translate', [
      state('collapse', style({ height: '0px', overflow: 'hidden'})),
      state('expanded', style({ height: '*', overflow: 'hidden'})),
      transition('collapse => expanded', [ animate('0.33s')]),
      transition('expanded => collapse', [animate('0.33s')])
    ]),
    trigger('rotate', [
      state('collapse', style({ transform: 'rotate(180deg)'})),
      state('expanded', style({ transform: 'rotate(270deg)'})),
      transition('collapse => expanded', [ animate('0.33s')]),
      transition('expanded => collapse', [animate('0.33s')])
    ])
  ]
})
export class TopBarComponent {
  userService: UserService;

  profileSuggestions: ProfileSel[] = [];

  profilePicBase: string;
  profilePicBaseBrand: string;

  searchTerm: string = "";


  wFriends: string = "assets/icons/w-friends.png";
  bFriends: string = "assets/icons/b-friends.png";
  curFriends: string = this.wFriends;

  wMessage: string = "assets/icons/w-message.png";
  bMessage: string = "assets/icons/b-message.png";
  curMessage: string = this.wMessage;

  wBell: string = "assets/icons/w-bell.png";
  bBell: string = "assets/icons/b-bell.png";
  curBell: string = this.wBell;


  menuExtended: boolean = false;

  toggleMenuExtension(){
    this.menuExtended = !this.menuExtended;
  }

  onHoverFriends(entered: boolean){
    this.curFriends = entered ? this.bFriends : this.wFriends;
  }

  onHoverMessage(entered: boolean){
    this.curMessage = entered ? this.bMessage : this.wMessage;
  }

  onHoverBell(entered: boolean){
    this.curBell = entered ? this.bBell : this.wBell;
  }

  onLogout(){
    this.authService.logout();
  }

  constructor(userService: UserService, private router: Router, private profileService: ProfileService, private authService: AuthService){
    this.userService = userService;
    this.profilePicBase = `${environment.image_service_url}Profile/of/`;
    this.profilePicBaseBrand = `${environment.image_service_url}Profile/byBrand/`;
  }

  navToProfile(){
    this.router.navigate(['profile'], {queryParams:{
      id: this.userService.getCurrentUserId()
    }})
  }

  navToHome(){
    this.router.navigate(['home']);
  }

  selectProfile(id: string){
    console.log("Selecting profile with id ", id);
    this.router.navigate(['profile'], {
      queryParams: {
        id
      }
    })
  }

  onSearchChange(){
    if(this.searchTerm.length == 0){
      this.profileSuggestions = [];
      return;
    }
    this.profileService.searchProfiles(this.searchTerm).subscribe({
      next: (sel: ProfileSel[])=> {
        this.profileSuggestions = sel;
      }
    })
  }
}
