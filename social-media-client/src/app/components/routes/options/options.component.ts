import { Component } from '@angular/core';
import { MobileBarComponent } from '../../repeats/mobile-bar/mobile-bar.component';
import { UserService } from '../../../services/user.service';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { DisplayService } from '../../../services/display.service';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [CommonModule, MobileBarComponent, RouterLink],
  templateUrl: './options.component.html',
  styleUrl: './options.component.css'
})
export class OptionsComponent {
  profileImage: string = "assets/icons/non-profile.png";
  homeDisplayName: string = "";
  currentProfile: string = "";

  userService: UserService;
  displayService: DisplayService;

  constructor(us: UserService, ds: DisplayService, private router: Router, private authService: AuthService){
    this.userService = us;
    this.displayService = ds;

    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd) {
        let endEvent: NavigationEnd = event;
      
        if(!endEvent.url.startsWith("/options"))
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

      }
    })
  }


  onLogout(){
    this.authService.logout();
  }
}
