import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Logger } from '@azure/msal-browser';
import { BooleanRef } from 'src/app/models/Holders';
import { PasswordChange } from 'src/app/models/Login';
import { SessionList } from 'src/app/models/Sessions';
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

  selectedFile:File | undefined;
  selectedFileType: string| undefined;
  permittedFileTypes = [
    "gif",
    "jpeg",
    "png",
    "svg",
    "webp"];

  changePassword: boolean = false;

  oldPassword: string = "";
  newPassword1: string = "";
  newPassword2: string = "";

  birthdayDetails: BirthdayDetails[];

  currentBirthdayDetail: BirthdayDetails;

  sessionList: SessionList | undefined;

  currentSession: string | undefined;

  selectedVerfiyFile:File | undefined;
  selectedVerifyFileType: string| undefined;

  constructor(userService: UserService, private router: Router) { 

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

  routeToSubscriptions()
  {
    this.router.navigate(['subscriptions']);
  }

  routeToBrands(){
    this.router.navigate(['brands']);
  }

  setChangePassword(b: boolean) {
    this.changePassword = b;
    this.oldPassword = "";
    this.newPassword1 = "";
    this.newPassword2 = "";
  }

  attemptEmailVerification() {
    this.userService.requestEmailVerification();
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

  refreshSessions() {
    this.userService.getSessions((sessionList : SessionList) => {
      this.sessionList = sessionList;
      console.log("Got Session!");
    },
      (currentSession: string) => {
        this.currentSession = currentSession;
        console.log("Current Session is ", this.currentSession);
      });
  }

  requestVerification() {
    this.userService.requestProfileVerification();
  }

  deleteSession(sessionId: string) {
    this.userService.removeSession(sessionId, () => this.refreshSessions());
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

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0]
    console.log("File Selectd: " + this.selectedFile);
    if(!this.selectedFile)return;

    let t = this.selectedFile.type.toLowerCase().trim();
    console.log("File Type is " + this.selectedFile.type + " ("+ t +") and name is " + this.selectedFile.name);
    for(let possibleType of this.permittedFileTypes) {
      if(t == `image/${possibleType}`)
      {
        this.selectedFileType = possibleType;
        break;
      }
    }
    console.log("Selected File type is " + this.selectedFileType);
  }

  updateProfilePic()
  {
    this.selectedFile?.arrayBuffer().then((value: ArrayBuffer)=> {
      let buffer = new Uint8Array(value);

      const STRING_CHAR = buffer.reduce((data, byte)=> {return data + String.fromCharCode(byte);}, '');

      let data = btoa(STRING_CHAR);

      let t = this.selectedFileType?.split('/');
      let ty = t?.pop();
      if(ty){
      this.userService.changeProfilePic(data, ty);
      }
    }).catch();
  }

  onVerifyFileChanged(event: any) {
    this.selectedVerfiyFile = event.target.files[0]
    console.log("File Selectd: " + this.selectedVerfiyFile);
    if(!this.selectedVerfiyFile)return;

    let t = this.selectedVerfiyFile.type.toLowerCase().trim();
    console.log("File Type is " + this.selectedVerfiyFile.type + " ("+ t +") and name is " + this.selectedVerfiyFile.name);
    for(let possibleType of this.permittedFileTypes) {
      if(t == `image/${possibleType}`)
      {
        this.selectedVerifyFileType = possibleType;
        break;
      }
    }
    console.log("Selected File type is " + this.selectedVerifyFileType);
  }

  uploadVerfiyPic()
  {
    this.selectedVerfiyFile?.arrayBuffer().then((value: ArrayBuffer)=> {
      let buffer = new Uint8Array(value);

      const STRING_CHAR = buffer.reduce((data, byte)=> {return data + String.fromCharCode(byte);}, '');

      let data = btoa(STRING_CHAR);

      let t = this.selectedVerifyFileType?.split('/');
      let ty = t?.pop();
      if(ty){
      this.userService.uploadVerificationPic(data, ty);
      }
    }).catch();
  }
}
