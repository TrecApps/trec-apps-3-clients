import { Component, ViewChild } from '@angular/core';
import { TopBarComponent } from '../../repeats/top-bar/top-bar.component';
import { PostEditComponent } from '../../repeats/post-edit/post-edit.component';
import { UserService } from '../../../services/user.service';
import { NavigationEnd, Router } from '@angular/router';
import { ConnectionListComponent } from '../../repeats/connection-list/connection-list.component';
import { environment } from '../../../environments/environment';
import { ProfileDetailsService } from '../../../services/profile-details.service';
import { SocialMediaEvent, SocialMediaEventList } from '../../../models/ProfileObjs';
import { PostHolderComponent } from '../../repeats/post-holder/post-holder.component';
import { CommonModule } from '@angular/common';
import { MobileBarComponent } from '../../repeats/mobile-bar/mobile-bar.component';
import { DisplayService } from '../../../services/display.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TopBarComponent, MobileBarComponent, PostEditComponent, ConnectionListComponent, PostHolderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  userService: UserService;
  currentProfile: string = "";
  homeDisplayName: string = "";
  profileImage: string = "assets/icons/non-profile.png";

  @ViewChild('homeConnections')
  homeConnections: ConnectionListComponent | undefined;

  homePageContent: SocialMediaEvent[];

  currentContentPage: number = 0;
  currentEarliestPost: number = 0;

  currentList: SocialMediaEventList | undefined;
  displayService: DisplayService;

  constructor(us: UserService, ds: DisplayService, private router: Router, private profileDetilsService: ProfileDetailsService){
    this.userService = us;
    this.displayService = ds;

    this.homePageContent = [];

    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd) {
        let endEvent: NavigationEnd = event;
      
        if(!endEvent.url.startsWith("/home"))
        {
          //console.log(`End Event url was ${endEvent.url}`);
          return;
        }

        if(us.tcBrand?.id){
          // we are using a brand account
          this.currentProfile = `Brand-${us.tcBrand.id}`;
          this.homeDisplayName = us.tcBrand.name || "";
          this.profileImage = `${environment.image_service_url}Profile/byBrand/${us.tcBrand.id}?app=${environment.app_name}`
        } else if(us.tcUser?.id) {
          this.currentProfile = `User-${us.tcUser.id}`;
          this.homeDisplayName = us.tcUser.displayName || "";
          this.profileImage = `${environment.image_service_url}Profile/of/${us.tcUser.id}?app=${environment.app_name}`;
        } else {
          // We are not logged in, nav to the login page
          router.navigateByUrl("/logon")
          return;
        }

        if(this.homeConnections){
          this.homeConnections.onPrepare();
        }

        this.profileDetilsService.initializeHomePageContent().subscribe({
          next: (list: SocialMediaEventList) => {
            this.currentContentPage = list.page;
            this.currentEarliestPost = list.earlyBounds;
            this.homePageContent = list.events.reverse();

            this.currentList = list;
          }
        })
      }
    })

  }

  getNextContent(){
    if(!this.currentList) return;
    this.profileDetilsService.getMoreContent(this.currentList).subscribe({
      next: (list: SocialMediaEventList) => {
        this.currentContentPage = list.page;
        this.currentEarliestPost = list.earlyBounds;
        this.homePageContent = list.events.reverse();

        this.currentList = list;
      }
    })
  }





}
