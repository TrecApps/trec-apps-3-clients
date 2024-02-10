import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { TopBarComponent } from '../../repeats/top-bar/top-bar.component';
import { ProfileService } from '../../../services/profile.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { PreProfileComponent } from '../pre-profile/pre-profile.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Profile, ProfileCreateBody, getProfileSkaffold } from '../../../models/ProfileObjs';
import { PreProfileService } from '../../../services/links/pre-profile.service';
import { ImageComponent } from '../../repeats/image/image.component';
import { FormsModule } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PostComponent } from '../../repeats/post/post.component';
import { Post, posts1 } from '../../../models/posts';
import { BrandSearcherComponent } from '../../repeats/brand-searcher/brand-searcher.component';
import { BRAND_RESOURCE_TYPE } from '../../../services/brand-resource-get.service';
import { BrandInfo } from '../../../models/BrandInfo';
import { AuthService } from '../../../services/auth.service';
import { ResponseObj } from '../../../models/ResponseObj';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule ,TopBarComponent, PreProfileComponent, HttpClientModule, ImageComponent, FormsModule, PostComponent, BrandSearcherComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  animations: [
    trigger('doShowDetails', [
      state('collapse', style({ height: '0px', overflow: 'hidden'})),
      state('expanded', style({ height: '*', overflow: 'hidden'})),
      transition('collapse => expanded', [ animate('0.33s')]),
      transition('expanded => collapse', [animate('0.33s')])
    ]),
    trigger('rotate', [
      state('collapse', style({ transform: 'rotate(180deg)'})),
      state('expanded', style({ transform: 'rotate(270deg)'})),
      transition('collapse => expanded', [ animate('0.33s')]),
      transition('expanded => collapse', [animate('0.33s')])
    ])
  ]
})
export class ProfileComponent implements OnInit{




  minHeight: string = "200px";
  maxHeight: string = "400px";

  profileService: ProfileService;
  userService: UserService;

  profileRequestBody: ProfileCreateBody | undefined;
  profile: Profile | undefined;
  isSelfProfile: boolean = false;

  // Track whether or not there would be two columns or 1
  isDouble: boolean;
  showProfileDetails: boolean = true;

  // Posts Section 
  postList: Post[] = [];

  // Profile Edit activation fields
  aboutMeEdit: boolean = false;

  profileNotFound: boolean = false;


  // Profile Edit activation methods
  toggleAboutMeEdit(){
    this.aboutMeEdit = !this.aboutMeEdit;
  }
  saveAboutMe(){
    // To-Do: Call Service to update About Me
  }

  toggleShowDetails(){
    this.showProfileDetails = !this.showProfileDetails;
  }

  @ViewChild('imageComp')
  imageComp: ImageComponent | undefined;

  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: number; }; }) {
    this.isDouble = this.checkIfDouneCol(event.target.innerWidth);
  }

  checkIfDouneCol(width: number){
    console.log("Width provided = " + width);
    return width > (696);
  }

  brandTypeFilm: string;
  brandTypeSong: string;
  brandTypeBook: string;

  // Tracking which components can be saved
  curAboutMe: String = "";
  moviesChanged: boolean = false;
  songsChanged: boolean = false;
  booksChanged: boolean = false;



  constructor(profileService: ProfileService, 
    userService: UserService,
     private router: Router,
     private route: ActivatedRoute,
     private authService: AuthService,
     private preProfileService: PreProfileService)
  {
    this.profileService = profileService;
    this.userService = userService;

    this.brandTypeFilm = BRAND_RESOURCE_TYPE.FILM;
    this.brandTypeSong = BRAND_RESOURCE_TYPE.SONG;
    this.brandTypeBook = BRAND_RESOURCE_TYPE.BOOK;


    router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
        let endEvent: NavigationEnd = event;
        if(endEvent.url != "/profile")
        {
          console.log(`End Event url was ${endEvent.url}`);
          return;
        }

        if(!this.authService.hasActiveTokens())
        {
          router.navigateByUrl("/logon")
          return;
        }

        let id: string| null = null;
        if(route.snapshot.queryParamMap.has("id")){
          id = route.snapshot.queryParamMap.get("id");
        }

        this.isDouble = this.checkIfDouneCol(window.innerWidth);

        // Ned to Uncomment this line once we are ready to test Back End Interactivity
        this.callProfileRetreival(id);
        //this.setUpFakeProfile(true);
      }
    });

    this.isDouble = this.checkIfDouneCol(window.innerWidth);
  }

  setUpFakeProfile(isSelf: boolean){
    this.isSelfProfile = isSelf;
    this.profile = getProfileSkaffold();

    this.postList = posts1;
  }

  callProfileRetreival(id: String | null){

    this.profileNotFound = false;

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
        this.curAboutMe = this.profile.aboutMe || "";
        this.profile.aboutMe = this.curAboutMe;
      } else if(id){
        this.profileNotFound = true;
      }
    }
    let target: String | null | undefined = id;
    console.log("Assessing User id " + id);
    this.isSelfProfile = this.userService.isCurrentUser(id);
    if(!target){
      target = this.userService.getCurrentUserId();
    }
    if(target)
      this.profileService.getProfile(target).subscribe({
        next: (profile: Profile) => {
          response(profile);
        },
        error: (e: any) => {
          let notAuthed = false;
          if(e instanceof Response){
            if (e.status == 401 || e.status == 403){
              notAuthed = true;
            }
          }

          if(notAuthed){
            this.router.navigateByUrl("/logon");
          } else {
            response(null);
          }
        }
    })

    // if(target){

      // response(null);

      // To-Do: Call Service for Profile Info and get profile info that way



    //}
  }

  ngOnInit(): void {
  }

  prepNewCoverPhoto() {
    if(this.profileRequestBody){
      this.preProfileService.setCoverImage("");
    }

    if(this.imageComp){
      this.imageComp.prepGallery(0);
    }
  }

  prepNewProfilePhoto() {
    if(this.imageComp){
      this.imageComp.prepGallery(0);
    }
  }

  createProfile(){
    if(!this.profileRequestBody){
      return;
    }
    console.log("Pre-Profile Body Before :", this.profileRequestBody);
    this.preProfileService.prepRequest(this.profileRequestBody);
    console.log("Pre-Profile Body After  :", this.profileRequestBody);

    this.profileService.establishProfile(this.profileRequestBody).subscribe({
      next: (profile: Profile) => {
        this.profile = profile;
        this.profileRequestBody = undefined;
      },
      error: (e: any) => {
        if(e instanceof Response) {
          if(e.status == 401 || e.status == 403){
            this.router.navigateByUrl("/logon");
          }
        }
      }
    })
  }

  updateAboutMe(){
    if(!this.profile || !this.profile.aboutMe){
       return;
    }

    let sAboutMe = this.profile.aboutMe;

    this.profileService.updateAboutMe(this.profile.aboutMe).subscribe({
      next: (ro: ResponseObj) => {
        alert(ro.message);
        this.curAboutMe = sAboutMe;
      },
      error: (ro: ResponseObj) => {
        alert(ro.message);
      }
    })
  }

  ///
  /// Methods to be added to recieve input from Child Components
  ///

  addMovie(bi: BrandInfo){
    if(!this.profile){
      return;
    }
    if(!this.profile.favoriteMovies){
      this.profile.favoriteMovies = [];
    }

    if(this.profile.favoriteMovies.indexOf(bi) == -1){
      this.profile.favoriteMovies.push(bi);
      this.moviesChanged = true;
    }
  }

  removeOptionMovie(brandInfo: BrandInfo) {
    if(!this.profile){
      return;
    }

    this.profile.favoriteMovies = this.profile.favoriteMovies.filter((bi: BrandInfo) => brandInfo.brandId != bi.brandId);
    this.moviesChanged = true;
  }

  updateMovies(){
    if(!this.profile) {
      return;
    }
    this.moviesChanged = false;
    this.profileService.updateMovies(this.profile.favoriteMovies).subscribe({
      next: (ro: ResponseObj) => {
        alert(ro.message);
      },
      error: (ro: ResponseObj) => {
        this.moviesChanged = true;
        alert(ro.message);
      }
    })
  }

  addSongs(bi: BrandInfo){
    if(!this.profile){
      return;
    }
    if(!this.profile.favoriteSongs){
      this.profile.favoriteSongs = [];
    }

    if(this.profile.favoriteSongs.indexOf(bi) == -1){
      this.profile.favoriteSongs.push(bi);
      this.songsChanged = true;
    }
  }

  removeOptionSong(brandInfo: BrandInfo) {
    if(!this.profile){
      return;
    }

    this.profile.favoriteSongs = this.profile.favoriteSongs.filter((bi: BrandInfo) => brandInfo.brandId != bi.brandId);
    this.songsChanged = true;
  }

  updateSongs(){
    if(!this.profile) {
      return;
    }
    this.songsChanged = false;
    this.profileService.updateSongs(this.profile.favoriteSongs).subscribe({
      next: (ro: ResponseObj) => {
        alert(ro.message);
      },
      error: (ro: ResponseObj) => {
        this.songsChanged = true;
        alert(ro.message);
      }
    })
  }

  addBook(bi: BrandInfo){
    if(!this.profile){
      return;
    }
    if(!this.profile.favoriteBooks){
      this.profile.favoriteBooks = [];
    }

    if(this.profile.favoriteBooks.indexOf(bi) == -1){
      this.profile.favoriteBooks.push(bi);
      this.booksChanged = true;
    }
  }

  removeOptionBook(brandInfo: BrandInfo) {
    if(!this.profile){
      return;
    }

    this.profile.favoriteBooks = this.profile.favoriteBooks.filter((bi: BrandInfo) => brandInfo.brandId != bi.brandId);
    this.booksChanged = true;
  }

  updateBooks(){
    if(!this.profile) {
      return;
    }
    this.booksChanged = false;
    this.profileService.updateBooks(this.profile.favoriteBooks).subscribe({
      next: (ro: ResponseObj) => {
        alert(ro.message);
      },
      error: (ro: ResponseObj) => {
        this.booksChanged = true;
        alert(ro.message);
      }
    })
  }
  
}
