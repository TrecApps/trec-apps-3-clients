import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MessagePaneHolderComponent } from './components/message-pane-holder/message-pane-holder.component';
import { HostListener } from "@angular/core";
import { DisplayService } from './services/display.service';
import { AuthService } from './services/auth.service';
import { MessagingService } from './services/messaging.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MessagePaneHolderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'social-media-client';

  screenHeight: number;
  screenWidth: number;
  displayService: DisplayService;

  constructor(displayService: DisplayService,
    private authService: AuthService, 
    private router: Router, 
    private messagingService: MessagingService, 
    private userService: UserService) {
    this.screenHeight = 0;
    this.screenWidth = 0;
    this.displayService = displayService;
    this.getScreenSize();
  }

  ngOnInit(): void {
    let onGainUser = (worked: boolean) => {
      if(worked){
        this.router.navigate(['home']);
      }
      // this.showSpinner = false;
    }


    this.authService.attemptRefresh(()=> {
      this.messagingService.onLogin();
        this.userService.refreshUser(onGainUser);
    });
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(_event?: any) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;

    this.displayService.setMobile(this.screenWidth < 768);
    this.displayService.setScreenHeight(this.screenHeight);
  }
}
