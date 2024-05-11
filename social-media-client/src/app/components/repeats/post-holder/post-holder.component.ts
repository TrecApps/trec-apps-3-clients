import { Component, Input, OnInit } from '@angular/core';
import { PostComponent } from '../post/post.component';
import { CommentComponent } from '../comment/comment.component';
import { SocialMediaEvent, SocialMediaEventType } from '../../../models/ProfileObjs';
import { PostService } from '../../../services/post.service';
import { CommentService } from '../../../services/comment.service';
import { ProfileDetailsService } from '../../../services/profile-details.service';
import { Comment, Post } from '../../../models/posts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-holder',
  standalone: true,
  imports: [CommonModule, PostComponent, CommentComponent],
  templateUrl: './post-holder.component.html',
  styleUrl: './post-holder.component.css'
})
export class PostHolderComponent implements OnInit {

  @Input()
  event: SocialMediaEvent = new SocialMediaEvent();

  post: Post | undefined;
  comment: Comment | undefined;

  displayName: string = "";

  reactionPost = SocialMediaEventType.POST_REACTION;
  reactionComment = SocialMediaEventType.COMMENT_REACTION;

  reactorProfile: string | undefined;

  constructor(private postService: PostService, private commentService: CommentService, private profileDetailsService: ProfileDetailsService){

  }
  ngOnInit(): void {
    
    this.profileDetailsService.getProfile(this.event.profile, (display: string | undefined) => {
      if(display){
        this.displayName = display;
      }
    })

    if(this.event.type == SocialMediaEventType.COMMENT || this.event.type == SocialMediaEventType.COMMENT_REACTION){
      this.commentService.getById(this.event.resourceId).subscribe({
        next: (value: Comment) => {
          this.comment = value;
          this.retrievePost(this.event.postId);
        },

      })
    } else {
      this.retrievePost(this.event.resourceId);
    }
  }

  retrievePost(id: string) {
    this.postService.getPost(id).subscribe({
      next: (value: Post) => {
        this.post = value;
      }
    })
  }


}
