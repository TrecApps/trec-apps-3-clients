import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import { ProfileSel } from '../../../models/ProfileObjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-mobile-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mobile-bar.component.html',
  styleUrl: './mobile-bar.component.css'
})
export class MobileBarComponent {

  userService: UserService;

  searchTerm:string = "";

  profilePicBase: string;
  profilePicBaseBrand: string;

  router: Router;
  profileSuggestions: ProfileSel[] = [];

  constructor(userService:UserService, router: Router, private profileService: ProfileService) {
    this.profilePicBase = `${environment.image_service_url}Profile/of/`;
    this.profilePicBaseBrand = `${environment.image_service_url}Profile/byBrand/`;
    this.userService = userService;
    this.router = router;
  }

  routeTo(route: string){
    this.router.navigateByUrl(route);
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

  selectProfile(id: string){
    this.router.navigate(['profile'], {
      queryParams: {
        id
      }
    })
  }

}
