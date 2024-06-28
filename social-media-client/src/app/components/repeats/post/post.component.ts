import { AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { AddPost, CommentList, CommentPost, Post, Comment, getPostProfile } from '../../../models/posts';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { Router, RouterModule } from '@angular/router';
import { HtmlRemoverPipe } from '../../../pipes/html-remover.pipe';
import { TcFormatterPipe } from '../../../pipes/tc-formatter.pipe';
import { ReactionButtonComponent, ReactionEvent } from '../reaction-button/reaction-button.component';
import { CommentComponent, CommentUpdate } from '../comment/comment.component';
import { ProfileService } from '../../../services/profile.service';
import { ReactionService } from '../../../services/reaction.service';
import { ReactionStats, ResponseObj } from '../../../models/ResponseObj';
import { Reaction } from '../../../models/Reaction';
import { CommentService } from '../../../services/comment.service';
import { UserService } from '../../../services/user.service';
import { DisplayService } from '../../../services/display.service';
import { ContextMenuComponent, MenuData } from '../context-menu/context-menu.component';
import { PostService } from '../../../services/post.service';
import { PostEditComponent } from '../post-edit/post-edit.component';


@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, RouterModule, HtmlRemoverPipe, TcFormatterPipe, ReactionButtonComponent, CommentComponent, ContextMenuComponent, PostEditComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
  encapsulation: ViewEncapsulation.None
})
export class PostComponent implements OnInit, AfterViewInit{
toggleCommentList(_t24: CommentList) {
  _t24.show = !_t24.show;
}

seekMoreComments() {
throw new Error('Method not implemented.');
}
  @Input()
  actPost: Post | undefined;

  @Input()
  editPost: AddPost | undefined;

  @ViewChild("likeButton")
  likeButton: ReactionButtonComponent | undefined;

  @ViewChild("dislikeButton")
  dislikeButton: ReactionButtonComponent | undefined;

  @Output()
  onDeleted = new EventEmitter<string>();

  editComment: CommentPost | undefined;

  imageLink: String;

  reactionId: number = -1;
  reactionType: string | undefined;

  defaultCommentCountSize: number = 10;
  commentCount: number = 0;

  hasMoreComments: boolean = true;

  displayService: DisplayService;
  
  menuItems: MenuData[] = [];

  postService: PostService;
  userService: UserService;

  isEditing: boolean = false;

  constructor(
    ds: DisplayService,
    userService: UserService,
    private reactionService: ReactionService,
    private commentService: CommentService,
    private router: Router,
    postService: PostService){
    this.imageLink = "assets/scaffolds/Profile_JLJ.png";

      this.displayService = ds;
      this.postService = postService;
      this.userService = userService;

  }
  ngAfterViewInit(): void {
    if(this.actPost){
      this.refreshReactionCount();
      this.getComments()
    }
  }

  navigateToProfile(){
    if(!this.actPost) return;

    let profile = getPostProfile(this.actPost);


      // First, check to see if we're already on this page
      if(this.router.url.includes(`profile?id=${profile}`)) return;

      // Next check to see if we're on the profile page but for ourselves
      if((this.router.url == `profile` || this.router.url == `/profile`) &&
          this.userService.getCurrentUserId() == `${profile}`) return;

      this.router.navigate(['profile'], {
        queryParams: {
          id: `${profile}`
        }
      })
 
  }

  preparingMenu: boolean = false;

  // Handlers for Context Menu
  onClickEdit(){
    this.isEditing = true;
  }
  onClickDelete() {
    let id = this.actPost?.postId;
    if(!id) return;
    this.postService.deletePost(id).subscribe({
      next: (value: ResponseObj) => {
        alert("Sucessfully Deleted");
        this.onDeleted.emit(id);
      }
    })
  }

  onClickMore() {

  }

  onClickMoreCat(){

  }

  onClickLess() {

  }
  onClickLessCat(){

  }

  clickFunctions: Function[] = [
    ()=> this.onClickEdit(),
    ()=> this.onClickDelete(),
    ()=> this.onClickMore(),
    ()=> this.onClickMoreCat(),
    ()=> this.onClickLess(),
    ()=> this.onClickLessCat(),
  ]

  prepContextMenu() {
    if(!this.actPost) return;

    this.preparingMenu = true;

    if(getPostProfile(this.actPost) == this.userService.getCurrentUserId()){
      // Self Post
      this.menuItems.push(new MenuData("Edit", 0));
      this.menuItems.push(new MenuData("Delete", 1));
    } else {
      // Other Post
      this.menuItems.push(new MenuData("See more from this user", 2));
      this.menuItems.push(new MenuData("See more from this user and category", 3));
      this.menuItems.push(new MenuData("", -1));
      this.menuItems.push(new MenuData("See less from this user", 4));
      this.menuItems.push(new MenuData("See less from this user and category", 5));
    }


  }

  menuSelected(item: MenuData){
    this.menuItems = [];

    if(item.funcIndex < 0 || item.funcIndex >= this.clickFunctions.length) return;
    
    this.clickFunctions[item.funcIndex]();
  }

  updating: boolean = false;

  doUpdatePost(p: AddPost){
    if(!this.actPost) return;

    if(this.updating) return;
    this.updating = true;

    p.id = this.actPost?.postId;

    this.postService.persistPost(p).subscribe({
      next: () => {
        this.actPost?.contents.push(p.content);
        this.cancelEdit();
      },
      error: () => {
        alert("Failed to Edit Post!");
        this.updating = false;
      }
    });
  }

  cancelEdit(){
    this.isEditing = false;
  }

  @HostListener('document:click', ['$event'])
  clickout(event:any) {
    if(this.preparingMenu){
      this.preparingMenu = false;
      return;
    }
      this.menuItems = [];
  }

  getComments() {
    if(!this.actPost?.postId) return;
    this.commentService.getCommentsByPost(this.actPost.postId.toString(), this.defaultCommentCountSize,this.commentCount).subscribe({
      next: (comments: Comment[]) => {
        if(!this.actPost) return;
        let cl = new CommentList();
        cl.comments = comments;
        cl.show = true;
        this.commentCount++;
        
        if(!this.actPost.comments)
          this.actPost.comments = [];

        this.actPost.comments.push(cl);

        this.hasMoreComments = cl.comments.length >= this.defaultCommentCountSize;
      }
    })
  }

  ngOnInit(): void {
    if(this.actPost){
      this.editComment = new CommentPost("", this.actPost?.postId || "", 0);


      let profile = getPostProfile(this.actPost);
      console.log(`Profile Post is ${profile}`);
      if(profile.startsWith("User-")){
        this.imageLink = `${environment.image_service_url}Profile/of/${profile.substring(5)}?app=${environment.app_name}`
      } else if(profile.startsWith("Brand-")) {
        this.imageLink = `${environment.image_service_url}Profile/byBrand/${profile.substring(6)}?app=${environment.app_name}`;
      }

    }
  }

  updateReactionStats(rs: ReactionStats) {
    this.reactionType = rs.yourReaction;
    if(rs.id){
      this.reactionId = rs.id;
    }


    if(!this.likeButton || !this.dislikeButton){
      return;
    }

    let actLikeButton = this.likeButton;
    let actDislikeButton = this.dislikeButton;

    actLikeButton.isSelected = false;
    actDislikeButton.isSelected = false;

    
    actLikeButton.setCount(rs.reactions['Like']);
    actDislikeButton.setCount(rs.reactions['Dislike']);

    switch(rs.yourReaction){
      case "Like":
        actLikeButton.isSelected = true;
        break;
      case "Dislike":
        actDislikeButton.isSelected = true;
        break;
    }
  }

  refreshReactionCount(){
    if(!this.actPost?.postId || !this.likeButton || !this.dislikeButton)return;

    this.reactionService.getReactionCountByPost(this.actPost.postId.toString()).subscribe({
      next: (rs: ReactionStats) => {
        this.updateReactionStats(rs);
      }
    })
  }

  postComment(){


    this.editComment = new CommentPost("", this.actPost?.postId || "", 0);

  }

  reactionOnSelect(reactionSelected: ReactionEvent | undefined){
    if(!reactionSelected || !this.actPost){
      return;
    }
    if(!this.actPost.returnReaction){
      this.actPost.returnReaction = new Reaction();
    }
    
    this.actPost.returnReaction.type = reactionSelected.type;
    this.actPost.returnReaction.positive = reactionSelected.isPositive;

    if(reactionSelected.type == this.reactionType){
      if(this.reactionId >= 0) {
        this.reactionService.removeReactionOnPost(this.reactionId).subscribe({
          next: (resp: ResponseObj) => {
            if(resp.reactStats){
              this.updateReactionStats(resp.reactStats);
            }
          }
        })
      }
    } else if(this.actPost.postId){
      let rId = this.reactionId >= 0 ? this.reactionId : undefined;
      this.reactionService.makeReactionOnPost(this.actPost.postId.toString(), reactionSelected.type.toString(), reactionSelected.isPositive, false, rId).subscribe({
        next: (resp: ResponseObj) => {
          if(resp.reactStats){
            this.updateReactionStats(resp.reactStats);
          }
        }
      });
    }

    
  }

  onCommentPersisted(cUpdate:CommentUpdate){
    
  }

  onCommentDeleted(id: string){
    
  }

}
