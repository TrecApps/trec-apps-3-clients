import { AfterContentInit, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { CommentPost, Comment, CommentList, getCommentProfile, getPostProfile } from '../../../models/posts';
import { ReactionButtonComponent, ReactionEvent } from '../reaction-button/reaction-button.component';
import { CommonModule } from '@angular/common';
import { HtmlRemoverPipe } from '../../../pipes/html-remover.pipe';
import { TcFormatterPipe } from '../../../pipes/tc-formatter.pipe';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../../services/comment.service';
import { ResponseObj } from '../../../models/ResponseObj';
import { UserService } from '../../../services/user.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { DisplayService } from '../../../services/display.service';
import { ContextMenuComponent, MenuData } from '../context-menu/context-menu.component';
import { ProfileDetailsService } from '../../../services/profile-details.service';
import { PostFilterRequest, SocialMediaEventType } from '../../../models/ProfileObjs';


export class CommentUpdate{
  isNew: boolean;
  id: string;
  constructor(i: boolean, id: string){
    this.id = id;
    this.isNew = i;
  }
}

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, FormsModule,HtmlRemoverPipe, TcFormatterPipe, ReactionButtonComponent, ContextMenuComponent],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit {
  @Input()
  actPost: Comment | undefined;

  @Input()
  editComment: CommentPost | undefined;

  @Input()
  parent = "";

  @Input()
  level: number = 0

  @Output()
  onCommentPersisted = new EventEmitter<CommentUpdate>();

  @Output()
  onDeleted = new EventEmitter<string>();

  editReply: CommentPost | undefined;
  defaultCommentCountSize: number = 10;
  commentCount: number = 0;

    toggleCommentList(_t24: CommentList) {
      _t24.show = !_t24.show;
    }
    
    seekMoreComments() {
    throw new Error('Method not implemented.');
    }

  commenterImageLink: string;
  currentProfImageLink: string;
  hasMoreReplies: boolean = true;

  displayService: DisplayService

  constructor(private commentService: CommentService,
    private userService: UserService,
    private router:Router,
    private profileDetailsService: ProfileDetailsService,
    ds: DisplayService) {
    this.commenterImageLink = "assets/icons/non-profile.png";
    this.currentProfImageLink = this.commenterImageLink;

    this.displayService = ds;
  }

  menuItems: MenuData[] = [];
  preparingMenu: boolean = false;


    // Handlers for Context Menu
    onClickEdit(){
      if(!this.actPost) return;
      let contents = this.actPost.contents;
      let commentMessage = contents.at(contents.length - 1);
      if(!commentMessage) return;

      this.editComment = new CommentPost(
        commentMessage.toString(),
        this.parent, this.level
      )
    }
    onClickDelete() {
      let id = this.actPost?.commentId;
      if(!id) return;
      this.commentService.deleteComment(id.toString()).subscribe({
        next: (value: ResponseObj) => {
          alert("Sucessfully Deleted");
          this.onDeleted.emit(id.toString());
        }
      })
    }
  
    onClickMore() {
      if(!this.actPost) return;
      let request = new PostFilterRequest();
      request.byProfile = true;
      request.decrease = true;
      request.from = getCommentProfile(this.actPost);
      request.type = SocialMediaEventType.COMMENT;
  
      this.profileDetailsService.uploadFilter(request).subscribe({
        next: (value: ResponseObj)=> {
          alert("Filter applied!");
        }
      })
    }

  
    onClickLess() {
      if(!this.actPost) return;
    let request = new PostFilterRequest();
    request.byProfile = true;
    request.decrease = true;
    request.from = getCommentProfile(this.actPost);
    request.type = SocialMediaEventType.COMMENT;

    this.profileDetailsService.uploadFilter(request).subscribe({
      next: (value: ResponseObj)=> {
        alert("Filter applied!");
      }
    })
    }

  
    clickFunctions: Function[] = [
      ()=> this.onClickEdit(),
      ()=> this.onClickDelete(),
      ()=> this.onClickMore(),
      ()=> this.onClickLess(),
    ]

  prepContextMenu() {
    if(!this.actPost) return;

    this.preparingMenu = true;

    if(getCommentProfile(this.actPost) == this.userService.getCurrentUserId()){
      // Self Post
      this.menuItems.push(new MenuData("Edit", 0));
      this.menuItems.push(new MenuData("Delete", 1));
    } else {
      // Other Post
      this.menuItems.push(new MenuData("See more from this user", 2));
      this.menuItems.push(new MenuData("", -1));
      this.menuItems.push(new MenuData("See less from this user", 3));
    }


  }

  menuSelected(item: MenuData){
    this.menuItems = [];

    if(item.funcIndex < 0 || item.funcIndex >= this.clickFunctions.length) return;
    
    this.clickFunctions[item.funcIndex]();
  }

  @HostListener('document:click', ['$event'])
  clickout(event:any) {
    if(this.preparingMenu){
      this.preparingMenu = false;
      return;
    }
      this.menuItems = [];
  }

  navigateToProfile(){
    if(!this.actPost) return;

    if(this.actPost.brandId){
      // First, check to see if we're already on this page
      if(this.router.url.includes(`profile?id=Brand-${this.actPost.brandId}`)) return;

      // Next check to see if we're on the profile page but for ourselves
      if((this.router.url == `profile` || this.router.url == `/profile`) &&
          this.userService.getCurrentUserId() == `Brand-${this.actPost.brandId}`) return;


      this.router.navigate(['profile'], {
        queryParams: {
          id: `Brand-${this.actPost.brandId}`
        }
      })
    } else if(this.actPost.userId){
      // First, check to see if we're already on this page
      if(this.router.url == `profile?id=User-${this.actPost.userId}`) return;

      // Next check to see if we're on the profile page but for ourselves
      if((this.router.url == `profile` || this.router.url == `/profile`) &&
            this.userService.getCurrentUserId() == `User-${this.actPost.userId}`) return;

      this.router.navigate(['profile'], {
        queryParams: {
          id: `User-${this.actPost.userId}`
        }
      })
    }
  }

  ngOnInit(): void {
      if(this.actPost){
        this.editReply = new CommentPost("", this.actPost.commentId , this.actPost.level + 1);
      }
      let curId = this.userService.getCurrentUserId();
      if(curId){
        let idSplit = curId.split("-");
        let actId = idSplit.at(1);
        if(idSplit.at(0) == "User" && actId){
          this.currentProfImageLink = `${environment.image_service_url}Profile/of/${actId}?app=${environment.app_name}`;
        } else {
          this.currentProfImageLink = `${environment.image_service_url}Profile/byBrand/${actId}?app=${environment.app_name}`;
        }
      }

      curId = this.actPost?.brandId || this.actPost?.userId;
      if(curId){
        
        if(this.actPost?.brandId){
          this.commenterImageLink = `${environment.image_service_url}Profile/byBrand/${curId}?app=${environment.app_name}`;
        } else {
          this.commenterImageLink = `${environment.image_service_url}Profile/of/${curId}?app=${environment.app_name}`;
        }
      }

      this.getReplies();

  }

  getReplies(){
    if(this.actPost){
      this.commentService.getCommentsByParent(this.actPost.commentId.toString(), this.defaultCommentCountSize, this.commentCount).subscribe({
        next: (comments: Comment[]) => {
          if(!this.actPost) return;
          let cl = new CommentList();
          cl.comments = comments;
          cl.show = true;
          this.commentCount++;

          if(!this.actPost.replies)
            this.actPost.replies = [];
          this.actPost.replies.push(cl);
          this.hasMoreReplies = cl.comments.length >= this.defaultCommentCountSize;
        }
      })
    }
  }

  reactionOnSelect(reactionSelected: ReactionEvent | undefined){
    if(!reactionSelected){
      return;
    }
    if(this.actPost?.returnReaction){
      this.actPost.returnReaction.type = reactionSelected.type;
      this.actPost.returnReaction.positive = reactionSelected.isPositive;
    }
  }

  newCommentHandler(updateComment: CommentUpdate){

    if(!this.actPost)return;

    let id = updateComment.id;

    this.commentService.getById(id).subscribe({
      next: (c: Comment) => {
        if(!this.actPost) return;
        if(updateComment.isNew){
          let ca = {c};
          if(!this.actPost.replies.length){
            let cl: CommentList = new CommentList();
            cl.show = true;
            cl.comments.push(c);
            this.actPost.replies.push(cl);
          } else {
            this.actPost.replies[0].comments.push(c);
          }
        } else {
          
          for(let cl of this.actPost?.replies){
            for(let rust = 0; rust < cl.comments.length; rust++){
              if(cl.comments[rust].commentId == id){
                cl.comments[rust] = c;
                return;
              }
            }
          }
        }
      }
    })

    
  }

  updating: boolean = false;

  uploadComment(){
    if(!this.editComment) return;

    if(this.updating) return;
    this.updating = true;

    if(this.actPost?.commentId){
      this.commentService.editComment(this.editComment, this.actPost.commentId.toString()).subscribe({
        next: (ro: ResponseObj) => {
          // if(ro.id)
          //   this.onCommentPersisted.emit(new CommentUpdate(false, ro.id.toString()));
          if(this.actPost && this.editComment?.comment){
            this.actPost.contents.push(this.editComment?.comment.toString())
          }
          this.editComment = undefined;
          this.updating = false;
        },
        error: () => this.updating = false
      })
    } else {
      this.commentService.postComment(this.editComment).subscribe({
        next: (ro: ResponseObj) => {
          if(ro.id)
          this.onCommentPersisted.emit(new CommentUpdate(true, ro.id.toString()));
          this.updating = false;
        },
        error: () => this.updating = false
      })
    }
  }

  onCommentDeleted(id: string){
    if(!this.actPost) return;
    for(let cl of this.actPost.replies){
      for(let commentIndex = 0; commentIndex < cl.comments.length; commentIndex++){
        let comment = cl.comments[commentIndex];
        if(comment.commentId == id)
        {
          cl.comments.splice(commentIndex, 1)
          return;
        }
      }
    }
  }

}
