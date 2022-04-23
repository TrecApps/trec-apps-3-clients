import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PasswordProfile, UserPost } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  usernameFree: boolean;
  updateFail:boolean;
  needsFields: boolean;
  user: UserPost;

  firstPassword:string;
  secondPassword: string;

  constructor(private userService:UserService, private router: Router) { 

    this.user = new UserPost();
    this.user.passwordProfile = new PasswordProfile();
    this.user.passwordProfile.password = "";
    this.usernameFree = true;
    this.updateFail = this.needsFields = false;
    this.firstPassword = "";
    this.secondPassword = "";
  }

  ngOnInit(): void {
  }

  create() {
    if(this.firstPassword != this.secondPassword){
      return;
    }

    if(!this.usernameFree){
      return;
    }
    if(!this.user.validate()) {
      this.needsFields = true;
    } else {
      this.needsFields = false;

      this.userService.createUser(this.user);
      this.moveToLogin();
    }
  }

  moveToLogin() {
    this.router.navigate(['/logon']);
  }
}
