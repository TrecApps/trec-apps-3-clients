import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalConstants } from '../../../common/GlobalConstants';
import { Login } from '../../../models/Login';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessagingService } from '../../../services/messaging.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DisplayService } from '../../../services/display.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  color1 ="white"
  color2 = "black"
  color3 = "gray"
  color4 = "yellow"
  color5 = "red"
  loginGradient = ""

  login: Login;
  loginFail: boolean;

  displayService: DisplayService;

  constructor(
    displayService: DisplayService,
    private authService:AuthService,
    private userService: UserService,
    private router:Router, 
    private messagingService: MessagingService) {
      this.displayService = displayService;
      this.login = new Login();
      this.loginFail = false;
   }

   showSpinner: boolean = false;

  ngOnInit(): void {
    
    this.color1 = GlobalConstants.lightBlue
    this.color2 = GlobalConstants.salmon
    this.color3 = GlobalConstants.siteBackground
    this.color4 = GlobalConstants.crownYellow
    this.color5 = GlobalConstants.red
    this.loginGradient = 'linear-gradient(45deg,' + this.color4 + ' 50%, ' + this.color1 + ' 80%)'

    this.authService.attemptRefresh(undefined);
  }


  logon() {

    if(this.showSpinner) return;

    let onGainUser = (worked: boolean) => {
      if(worked){
        this.router.navigate(['home']);
      }
      this.showSpinner = false;
    }
    this.showSpinner = true;

    this.authService.loginThroughTrecApps(this.login, (worked: boolean) => {

      if(!worked) {
        this.loginFail = true;
        this.showSpinner = false;
      } else {
        this.messagingService.onLogin();
        this.userService.refreshUser(onGainUser);
        
      }
    });
  }

  mouseOver() {
    var op = document.getElementById("Globe2")
    if(op) {
     
      op.style.opacity = ".9"
    }
  }

  // moveToCreate() {
  //   this.router.navigate(['/create']);
  // }
}
