import { Component, EventEmitter, Input, Output } from '@angular/core';


export class ReactionEvent {
  type: String;
  isPositive: boolean;

  constructor(t: String, ip: boolean){
    this.isPositive = ip;
    this.type = t;
  }
}

@Component({
  selector: 'app-reaction-button',
  standalone: true,
  imports: [],
  templateUrl: './reaction-button.component.html',
  styleUrl: './reaction-button.component.css'
})
export class ReactionButtonComponent {
  @Input()
  divClass:String = "post-reaction-holder";

  @Input()
  reactionType: String = "_";

  @Input()
  isSelected: boolean = false;

  @Input()
  positiveReaction: boolean = true;

  @Output()
  onSelectedEmitter = new EventEmitter<ReactionEvent>();

  onSelected(){
    this.onSelectedEmitter.emit(new ReactionEvent(this.reactionType, this.positiveReaction));
  }
}
