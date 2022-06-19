import { Component, OnInit } from '@angular/core';
import { Logger } from '@azure/msal-browser';
import { BooleanRef } from 'src/app/models/Holders';
import { PasswordChange } from 'src/app/models/Login';
import { UserService } from 'src/app/services/user.service';

class BirthdayDetails {
  setting: string;
  details: string;

  constructor(settings:string, details:string) {
    this.details = details;
    this.setting = settings;
  }
}

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnInit {

  userActive: BooleanRef;
  userService: UserService;

  changePassword: boolean = false;

  oldPassword: string = "";
  newPassword1: string = "";
  newPassword2: string = "";

  birthdayDetails: BirthdayDetails[];

  currentBirthdayDetail: BirthdayDetails;

  constructor(userService: UserService) { 

    this.userActive = new BooleanRef(false);
    this.userService = userService;

    this.birthdayDetails = [];
    this.currentBirthdayDetail = new BirthdayDetails("","");

    this.birthdayDetails.push(new BirthdayDetails("Public", "Your Birthday is readable by anyone!"));
    this.birthdayDetails.push(new BirthdayDetails("Broadcast", "Your Birthday will be public and services with 'friends' will broadcast it to your 'friends'!"));
    this.birthdayDetails.push(new BirthdayDetails("Private Broadcast", "Your Birthday will be broadcast to 'friends' but hidden from anywhere else"));
    this.birthdayDetails.push(new BirthdayDetails("Friends", "Only your friends can see your birthday, but it will not be broadcast!"));
    this.birthdayDetails.push(new BirthdayDetails("Private", "Your birthday will be kept private! You can grant access to specific services!"));
  }

  setChangePassword(b: boolean) {
    this.changePassword = b;
    this.oldPassword = "";
    this.newPassword1 = "";
    this.newPassword2 = "";
  }



  ngOnInit(): void {
  }

  refreshUser() {
    this.userService.refreshUser(this.userActive, () => {
      console.log("In RefreshUser Method. Current userActive Value is ", this.userActive.value);
      let currentBirthdaySetting = this.userService.currentUser.birthdaySetting;

      for(let birthdayDetail of this.birthdayDetails) {
        if(birthdayDetail.setting == currentBirthdaySetting){
          this.currentBirthdayDetail = birthdayDetail;
          break;
        }
      }
    });
  }

  updateUser(){
    this.userService.currentUser.birthdaySetting = this.currentBirthdayDetail.setting;

    this.userService.updateUser();
  }

  updatePassword() {
    if(this.newPassword1 != this.newPassword2) {
      alert("New Password Fields Must match!");
      return;
    }
    if(this.newPassword1.length < 12) {
      alert("Paswords must be a minumum of 12 characters");
      return;
    }

    let changePasswordObj = new PasswordChange();
    changePasswordObj.currentPassword = this.oldPassword;
    changePasswordObj.newPassword = this.newPassword1;
    this.userService.changePassword(changePasswordObj);
    this.setChangePassword(false);
  }
}
