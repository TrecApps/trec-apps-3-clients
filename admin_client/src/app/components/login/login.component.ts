import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalConstants } from 'src/app/common/GlobalConstants';
import { Login } from 'src/app/models/Login';
import { AuthService } from 'src/app/services/auth.service';


  //[ngStyle]="{background: 'linear-gradient(45deg, blue 50%, red 80%)'}"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  color1 ="white"
  color2 = "black"
  color3 = "gray"
  color4 = "yellow"
  color5 = "red"
  loginGradient = ""

  login: Login;
  loginFail: boolean;

  constructor(private authService:AuthService, private router:Router) {
    this.login = new Login();
    this.loginFail = false;
   }

  ngOnInit(): void {
    
    this.color1 = GlobalConstants.lightBlue
    this.color2 = GlobalConstants.salmon
    this.color3 = GlobalConstants.siteBackground
    this.color4 = GlobalConstants.crownYellow
    this.color5 = GlobalConstants.red
    this.loginGradient = 'linear-gradient(45deg,' + this.color4 + ' 50%, ' + this.color1 + ' 80%)'
  }


  logon() {
    this.authService.loginThroughTrecApps(this.login, (worked: boolean) => {
      if(!worked) {
        this.loginFail = true;
      } else {
        this.router.navigate(['Welcome']);
      }
    });
  }

  mouseOver() {
    var op = document.getElementById("Globe2")
    console.log(op)
    if(op) {
     
      op.style.opacity = ".9"
    }
  }

  moveToCreate() {
    this.router.navigate(['/create']);
  }

}
