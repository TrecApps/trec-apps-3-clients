import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentPost, Comment, CommentList } from '../../../models/posts';
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
  imports: [CommonModule, FormsModule,HtmlRemoverPipe, TcFormatterPipe, ReactionButtonComponent],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit {
  @Input()
  actPost: Comment | undefined;

  @Input()
  editComment: CommentPost | undefined;

  @Output()
  onCommentPersisted = new EventEmitter<CommentUpdate>();

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

  constructor(private commentService: CommentService, private userService: UserService, private router:Router) {
    this.commenterImageLink = "assets/icons/non-profile.png";
    this.currentProfImageLink = this.commenterImageLink;
  }

  navigateToProfile(){
    console.log(`url is ${this.router.url}`);
    if(!this.actPost) return;
    console.log("Post in Question: ", this.actPost);

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
        console.log("Getting commenter ID ", curId);
        
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

  uploadComment(){
    if(!this.editComment) return;
    if(this.actPost?.commentId){
      this.commentService.editComment(this.editComment, this.actPost.commentId.toString()).subscribe({
        next: (ro: ResponseObj) => {
          if(ro.id)
          this.onCommentPersisted.emit(new CommentUpdate(false, ro.id.toString()));
        }
      })
    } else {
      this.commentService.postComment(this.editComment).subscribe({
        next: (ro: ResponseObj) => {
          if(ro.id)
          this.onCommentPersisted.emit(new CommentUpdate(true, ro.id.toString()));
        }
      })
    }
  }
}
