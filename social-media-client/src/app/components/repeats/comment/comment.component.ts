import { AfterContentInit, Component, Input, OnInit } from '@angular/core';
import { CommentPost, Comment, CommentList } from '../../../models/posts';
import { ReactionButtonComponent, ReactionEvent } from '../reaction-button/reaction-button.component';
import { CommonModule } from '@angular/common';
import { HtmlRemoverPipe } from '../../../pipes/html-remover.pipe';
import { TcFormatterPipe } from '../../../pipes/tc-formatter.pipe';
import { FormsModule } from '@angular/forms';

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

  editReply: CommentPost | undefined;

    toggleCommentList(_t24: CommentList) {
      _t24.show = !_t24.show;
    }
    
    seekMoreComments() {
    throw new Error('Method not implemented.');
    }

  imageLink: String;

  constructor() {
    this.imageLink = "assets/scaffolds/Profile_JLJ.png";

  }

  ngOnInit(): void {
      if(this.actPost){
        this.editReply = new CommentPost("", this.actPost.commentId , this.actPost.level + 1);
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


  uploadComment(){
    
  }
}
