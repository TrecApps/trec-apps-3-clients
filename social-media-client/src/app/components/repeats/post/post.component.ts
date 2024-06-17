import { AfterContentInit, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AddPost, CommentList, CommentPost, Post, Comment } from '../../../models/posts';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { Router, RouterModule } from '@angular/router';
import { HtmlRemoverPipe } from '../../../pipes/html-remover.pipe';
import { TcFormatterPipe } from '../../../pipes/tc-formatter.pipe';
import { ReactionButtonComponent, ReactionEvent } from '../reaction-button/reaction-button.component';
import { CommentComponent } from '../comment/comment.component';
import { ProfileService } from '../../../services/profile.service';
import { ReactionService } from '../../../services/reaction.service';
import { ReactionStats, ResponseObj } from '../../../models/ResponseObj';
import { Reaction } from '../../../models/Reaction';
import { CommentService } from '../../../services/comment.service';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, RouterModule, HtmlRemoverPipe, TcFormatterPipe, ReactionButtonComponent, CommentComponent],
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

  editComment: CommentPost | undefined;

  imageLink: String;

  reactionId: number = -1;
  reactionType: string | undefined;

  defaultCommentCountSize: number = 10;
  commentCount: number = 0;

  hasMoreComments: boolean = true;

  constructor(
    private userService: UserService,
    private reactionService: ReactionService,
    private commentService: CommentService,
    private router: Router){
    //this.imageLink = `${environment.image_service_url}Profile/`;
    this.imageLink = "assets/scaffolds/Profile_JLJ.png";



  }
  ngAfterViewInit(): void {
    if(this.actPost){
      this.refreshReactionCount();
      this.getComments()
    }
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
    }
  }

  updateReactionStats(rs: ReactionStats) {
    console.log("Updating Reation Stats");
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
    console.log("Refresh Reaction count called: ", this.actPost);
    console.log("Like Button is ", this.likeButton);
    if(!this.actPost?.postId || !this.likeButton || !this.dislikeButton)return;

    this.reactionService.getReactionCountByPost(this.actPost.postId.toString()).subscribe({
      next: (rs: ReactionStats) => {
        console.log("Retrieved Reaction Stats");
        this.updateReactionStats(rs);
      }
    })
  }

  postComment(){


    this.editComment = new CommentPost("", this.actPost?.postId || "", 0);

  }

  reactionOnSelect(reactionSelected: ReactionEvent | undefined){
    console.log("Reaction Event: ", reactionSelected);
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

}
