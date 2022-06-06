import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/Login';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login: Login;
  loginFail: boolean;

  constructor(private authService:AuthService, private router:Router) {
    this.login = new Login();
    this.loginFail = false;
   }

  ngOnInit(): void {
  }

  logon() {
    this.authService.loginThroughTrecApps(this.login, (worked: boolean) => {
      if(!worked) {
        this.loginFail = true;
      } else {
        this.router.navigate(['user']);
      }
    });
  }



  moveToCreate() {
    this.router.navigate(['/create']);
  }

}
