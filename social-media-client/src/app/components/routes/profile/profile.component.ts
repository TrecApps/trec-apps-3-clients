import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { TopBarComponent } from '../../repeats/top-bar/top-bar.component';
import { ProfileService } from '../../../services/profile.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import {} from '@angular/common/http';
import { PreProfileComponent } from '../pre-profile/pre-profile.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Profile, ProfileCreateBody, getProfileSkaffold } from '../../../models/ProfileObjs';
import { PreProfileService } from '../../../services/links/pre-profile.service';
import { ImageComponent } from '../../repeats/image/image.component';
import { FormsModule } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PostComponent } from '../../repeats/post/post.component';
import { AddPost, Post, posts1 } from '../../../models/posts';
import { BrandSearcherComponent } from '../../repeats/brand-searcher/brand-searcher.component';
import { BRAND_RESOURCE_TYPE } from '../../../services/brand-resource-get.service';
import { BrandInfo } from '../../../models/BrandInfo';
import { AuthService } from '../../../services/auth.service';
import { ResponseObj } from '../../../models/ResponseObj';
import { environment } from '../../../environments/environment';
import { ImageInsert, PostEditComponent } from '../../repeats/post-edit/post-edit.component';
import { PostService } from '../../../services/post.service';
import { ConnectionService } from '../../../services/connection.service';
import { ConnectionListComponent } from '../../repeats/connection-list/connection-list.component';
import { BlockService } from '../../../services/block.service';
import { MessagingService } from '../../../services/messaging.service';
import { ConversationEntry } from '../../../models/Messaging';
import { MobileBarComponent } from '../../repeats/mobile-bar/mobile-bar.component';
import { DisplayService } from '../../../services/display.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule ,TopBarComponent, 
    PreProfileComponent, 
    ImageComponent, FormsModule,
    PostComponent, BrandSearcherComponent, 
    PostEditComponent, ConnectionListComponent,
    MobileBarComponent],
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
  message() {
    if(this.profile?.displayName)
    this.messageService.prepConversation(this.profileId, this.profile.displayName.toString(), (val: ConversationEntry | undefined) => {
      if(!val){
        alert("Could not initiate Conversation");
      } else {
        this.messageService.setConversation(val);
      }
    })
  }




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

  categoryList: string[] = [];

  connectionStatus: string = "";
  profileId: string = "";
  connectionId: number = -1;

  showMode: number = 0;

  // ConnectionLists
  @ViewChild('confirmedList')
  confirmedList: ConnectionListComponent| undefined;

  // @ViewChild('awaitList')
  // awaitList: ConnectionListComponent | undefined;

  // @ViewChild('respondList')
  // respondList: ConnectionListComponent | undefined;

  setShowMode(sm: number){
    this.showMode = sm;
    if(this.showMode && this.confirmedList 
      //&& this.awaitList && this.respondList
      ){
      this.confirmedList.onPrepare();
    }
  }

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

  @ViewChild('postEditor')
  postEditor: PostEditComponent | undefined;

  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: number; }; }) {
    this.isDouble = this.checkIfDouneCol(event.target.innerWidth);
  }

  checkIfDouneCol(width: number){
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



  // Strings pointing to the cover and profile pictures
  coverPhotoUrl: string = "";
  profilePicUrl: string = "";

  coverPhotoFallback(){
    this.profileService.setCoverPhoto("/assets/icons/non-cover.png")
  }

  profilePicFallback(){
    this.profileService.setProfilePhoto("/assets/icons/non-profile.png")
  }

  displayService: DisplayService;

  constructor(profileService: ProfileService, 
    userService: UserService,
    ds: DisplayService,
     private router: Router,
     private route: ActivatedRoute,
     private authService: AuthService,
     private preProfileService: PreProfileService,
     private postService: PostService,
     private connectionService: ConnectionService,
     private blockService: BlockService,
     private messageService: MessagingService)
  {
    this.profileService = profileService;
    this.userService = userService;

    this.displayService = ds;

    //this.profilePicUrl = `${envir}`

    this.brandTypeFilm = BRAND_RESOURCE_TYPE.FILM;
    this.brandTypeSong = BRAND_RESOURCE_TYPE.SONG;
    this.brandTypeBook = BRAND_RESOURCE_TYPE.BOOK;


    router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
        let endEvent: NavigationEnd = event;
      
        if(!endEvent.url.startsWith("/profile"))
        {
          //console.log(`End Event url was ${endEvent.url}`);
          return;
        }

        if(!this.authService.hasActiveTokens())
        {
          router.navigateByUrl("/logon")
          return;
        }

        this.connectionStatus = "";
        this.connectionId = -1;

        let id: string| null = null;
        if(this.route.snapshot.queryParamMap.has("id")){
          id = this.route.snapshot.queryParamMap.get("id");
        }

        this.isDouble = this.checkIfDouneCol(window.innerWidth);

        if(this.showMode == 1 && this.confirmedList){
          this.confirmedList.connections = [];
          this.showMode = 0;
        }

        // Ned to Uncomment this line once we are ready to test Back End Interactivity
        this.callProfileRetreival(id);
        //this.setUpFakeProfile(true);
      }
    });

    this.isDouble = this.checkIfDouneCol(window.innerWidth);
  }

  requestConnection(){
    this.connectionService.makeConnectionRequest(this.profileId).subscribe({
      next: (ro: ResponseObj) => {
        alert("Request Made!");
        this.connectionStatus = "AWAITING";
        if(ro.id)
        this.connectionId = parseInt(ro.id.toString());
      }
    })
  }

  respondToConnection(confirming: boolean){
    this.connectionService.makeConnectionResponse(this.profileId, confirming).subscribe({
      next: (ro: ResponseObj) => {
        this.connectionStatus = confirming ? "CONNECTED": "NOT_FOUND";
      }
    })
  }

  removeConnection(){
    if(this.connectionId == -1) return;
    this.connectionService.removeConnection(this.connectionId).subscribe({
      next: (ro: ResponseObj) => {
        this.connectionId = -1;
        this.connectionStatus = 'NOT_FOUND';

      }
    })
  }



  setUpFakeProfile(isSelf: boolean){
    this.isSelfProfile = isSelf;
    this.profile = getProfileSkaffold();

    this.postList = posts1;
  }

  callProfileRetreival(id: String | null){

    this.postList = [];

    this.profileNotFound = false;


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
    this.isSelfProfile = this.userService.isCurrentUser(id);
    if(!target){
      target = this.userService.getCurrentUserId();
    }
    if(target){
      
      let strTarget = target;
      this.profileService.getProfile(target).subscribe({
        next: (profile: Profile) => {

          if(!this.isSelfProfile){
            this.profileService.getConnectionStatus(strTarget.toString()).subscribe({
              next: (ro: ResponseObj) => this.connectionStatus = ro.message.toString()
            })
          }

          response(profile);
          
          this.foundEndOfPosts = false;
          this.profileId = strTarget.toString();

          let idSplit = strTarget.split("-");

          let actId = idSplit.at(1);


          if(idSplit.at(0) == "User" && actId){
            this.profileService.setProfilePhoto(`${environment.image_service_url}Profile/of/${actId}?app=${environment.app_name}`);
            this.profileService.setCoverPhoto(`${environment.image_service_url}Profile/of/${actId}?app=cover-${environment.app_name}&falback=not_found`);
            this.retrievePosts(actId.toString(), true);
          } else if(actId){
            this.profileService.setProfilePhoto(`${environment.image_service_url}Profile/byBrand/${actId}?app=${environment.app_name}`);
            this.profileService.setCoverPhoto(`${environment.image_service_url}Profile/byBrand/${actId}}?app=cover-${environment.app_name}&falback=not_found`);
            this.retrievePosts(actId.toString(), false);
          }

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
    }
  }

  foundEndOfPosts = false;
  postPageSize = 10;

  retrievePosts(id: string, byUser: boolean){

    if(this.foundEndOfPosts) {
      return;
    }

    let observe = {
      next: (posts: Post[]) => {
        if(posts.length < this.postPageSize){
          this.foundEndOfPosts = true;
        }
        this.postList = this.postList.concat(posts);
      }
    }

    if(byUser) {
      this.postService.getByUser(id, this.postList.length / this.postPageSize, this.postPageSize).subscribe(observe);
    } else {
      this.postService.getByBrand(id, this.postList.length / this.postPageSize, this.postPageSize).subscribe(observe);
    }

  }

  prepBlock(){
    let allApps = confirm("Do you wish to block this person Across all of TrecApps?");

    if(!confirm("Are you sure you wish to block this person. You will not be visible to them.")){
      return;
    }

    this.blockService.blockPerson(this.profileId, !allApps).subscribe({
      next: (ro: ResponseObj) => {
        alert(`Successfully Blocked ${this.profile?.displayName}`);
      },
      error: (ro: ResponseObj) => {
        alert(ro.message);
      }
    })
  }

  ngOnInit(): void {
    this.categoryList = this.postService.categoryList;
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
      this.imageComp.prepGallery(1);
    }
  }

  createProfile(){
    if(!this.profileRequestBody){
      return;
    }
    this.preProfileService.prepRequest(this.profileRequestBody);

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


  // Post Management

  updatePost(id: string, addPost: AddPost) {
    for(let p of this.postList){
      if(p.postId == id) {
        p.contents.push(addPost.content);
        break;
      }
    }
  }

  makePost(addPost: AddPost){

    let error = (r: Response) => {
      alert("Could not Persist Post!");
      if(r.status == 401){
        this.authService.logout();
      }
    }

    let observe = addPost.id ? {
      next: (ro: ResponseObj) => {
        if(ro.id){
          this.updatePost(ro.id.toString(), addPost);
        }
      },
      error
    } : {
      next: (ro: ResponseObj) => {
        if(ro.id){
          this.postService.getPost(ro.id.toString()).subscribe({
            next: (p: Post) => {
              this.postList.unshift(p);
            }
          })
        }
      },
      error
    }

    this.postService.persistPost(addPost).subscribe(observe);
  }

  activateImage(){
    if(this.imageComp){
      this.imageComp.prepGallery(2);
    }
  }

  insertImage(imageInsert: ImageInsert){
    this.imageComp?.hideGallery();
    this.postEditor?.addImage(imageInsert);
  }
  
}
