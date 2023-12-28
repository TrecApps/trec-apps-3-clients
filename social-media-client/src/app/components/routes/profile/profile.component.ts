import { Component, OnInit } from '@angular/core';
import { TopBarComponent } from '../../repeats/top-bar/top-bar.component';
import { ProfileService } from '../../../services/profile.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { PreProfileComponent } from '../pre-profile/pre-profile.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Profile, ProfileCreateBody } from '../../../models/ProfileObjs';
import { PreProfileService } from '../../../services/links/pre-profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule ,TopBarComponent, PreProfileComponent, HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  minHeight: string = "200px";
  maxHeight: string = "400px";

  profileService: ProfileService;
  userService: UserService;

  profileRequestBody: ProfileCreateBody | undefined;
  profile: Profile | undefined;
  isSelfProfile: boolean = false;

  constructor(profileService: ProfileService, 
    userService: UserService,
     private router: Router,
     private route: ActivatedRoute,
     private preProfileService: PreProfileService){
    this.profileService = profileService;
    this.userService = userService;

    router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
        let endEvent: NavigationEnd = event;
        if(endEvent.url != "/profile")
        {
          console.log(`End Event url was ${endEvent.url}`);
          return;
        }

        let id: string| null = null;
        if(route.snapshot.queryParamMap.has("id")){
          id = route.snapshot.queryParamMap.get("id");
        }
        this.callProfileRetreival(id);
      }
    });
  }

  callProfileRetreival(id: String | null){

    console.log(`call Profile Retrievale called with id = ${id}`);

    let response = (obj: Profile | null) => {
      if(!obj && !id){
        this.profileRequestBody = new ProfileCreateBody();
        let displayName = this.userService.getCurrentDisplayName();
        if(displayName){
          this.preProfileService.setDisplayName(displayName);
        }
        this.preProfileService.setPronounsList(["(He/Him)", "(She/Her)", "(They/Them)"]);


      } else if (obj) {
        this.profile = obj;
      }
    }
    let target: String | null | undefined = id;
    this.isSelfProfile = this.userService.isCurrentUser(id);
    if(!target){
      target = this.userService.getCurrentUserId();
    }

    // if(target){

      response(null);

      // To-Do: Call Service for Profile Info and get profile info that way



    //}
  }

  ngOnInit(): void {
  }

  prepNewCoverPhoto() {
    if(this.profileRequestBody){
      this.preProfileService.setCoverImage("");
    }
  }

  prepNewProfilePhoto() {
    
  }

  createProfile(){
    
  }
}
