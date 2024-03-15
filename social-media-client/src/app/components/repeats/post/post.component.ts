import { AfterContentInit, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AddPost, CommentList, CommentPost, Post } from '../../../models/posts';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { RouterModule } from '@angular/router';
import { HtmlRemoverPipe } from '../../../pipes/html-remover.pipe';
import { TcFormatterPipe } from '../../../pipes/tc-formatter.pipe';
import { ReactionButtonComponent, ReactionEvent } from '../reaction-button/reaction-button.component';
import { CommentComponent } from '../comment/comment.component';
import { ProfileService } from '../../../services/profile.service';
import { ReactionService } from '../../../services/reaction.service';
import { ReactionStats, ResponseObj } from '../../../models/ResponseObj';
import { Reaction } from '../../../models/Reaction';

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

  constructor(private profileService: ProfileService, private reactionService: ReactionService){
    //this.imageLink = `${environment.image_service_url}Profile/`;
    this.imageLink = "assets/scaffolds/Profile_JLJ.png";



  }
  ngAfterViewInit(): void {
    if(this.actPost){
      this.refreshReactionCount();
    }
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
