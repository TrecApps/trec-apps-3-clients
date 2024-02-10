import { AfterContentInit, Component, Input, OnInit } from '@angular/core';
import { AddPost, CommentList, CommentPost, Post } from '../../../models/posts';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { RouterModule } from '@angular/router';
import { HtmlRemoverPipe } from '../../../pipes/html-remover.pipe';
import { TcFormatterPipe } from '../../../pipes/tc-formatter.pipe';
import { ReactionButtonComponent, ReactionEvent } from '../reaction-button/reaction-button.component';
import { CommentComponent } from '../comment/comment.component';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, RouterModule, HtmlRemoverPipe, TcFormatterPipe, ReactionButtonComponent, CommentComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit{
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

  editComment: CommentPost | undefined;

  imageLink: String;

  constructor(private profileService: ProfileService){
    //this.imageLink = `${environment.image_service_url}Profile/`;
    this.imageLink = "assets/scaffolds/Profile_JLJ.png";

  }
  ngOnInit(): void {
    if(this.actPost){
      this.editComment = new CommentPost("", this.actPost?.postId || "", 0);
    }
  }

  postComment(){


    this.editComment = new CommentPost("", this.actPost?.postId || "", 0);

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

}
