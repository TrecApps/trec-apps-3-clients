import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Profile } from '../../../models/ProfileObjs';
import { AddPost } from '../../../models/posts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HtmlRemoverPipe } from '../../../pipes/html-remover.pipe';
import { TcFormatterPipe } from '../../../pipes/tc-formatter.pipe';

export class ImageInsert {
  id: string;
  content: string | undefined;

  constructor(id: string){
    this.id = id;
  }

  static generate(id: string, content?: string) : ImageInsert {
    let ret = new ImageInsert(id);
    if(content){
      ret.content = content;
    }
    return ret;
  }
}

@Component({
  selector: 'app-post-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, HtmlRemoverPipe, TcFormatterPipe],
  templateUrl: './post-edit.component.html',
  styleUrl: './post-edit.component.css'
})
export class PostEditComponent implements OnInit {

  @Input()
  moduleId: String | undefined;

  @Input()
  profilePic: string | undefined;

  @Input()
  categoryList: string[] = [];

  @Input()
  targetProfile: string | undefined;

  @Output()
  makePost = new EventEmitter<AddPost>();

  @Output()
  imageActivator = new EventEmitter();

  @ViewChild('myArea')
  theEditor: ElementRef<HTMLTextAreaElement> | undefined;

  post: AddPost;

  isBold: boolean = false;
  isItalic: boolean = false;

  showGallery: boolean = false;

  constructor(){
    this.post = new AddPost();
  }

  imageList: string[] = [];

  addImage(iInsert: ImageInsert){
    let textElement = this.retrieveElement();
    if(!textElement){
      return;
    }
    let textInsert = `\n:Image:${iInsert.id}\n`;

    let preText = this.post.content.substring(0, textElement.selectionStart);
    let postText = this.post.content.substring(textElement.selectionEnd);
  
    this.post.content = `${preText}${textInsert}${postText}`;

    this.changeSelection(textElement, textInsert.length);
  }

  ngOnInit(): void {
      this.post.moduleId = this.moduleId;
  }

  setPost(post: AddPost){
    this.post = post;
  }


  // Edit Methods
  retrieveElement(): HTMLTextAreaElement | undefined {
    if(this.theEditor){
      return this.theEditor.nativeElement;
    }
    return undefined;
  }

    toggleCodeStat(marker: string, isActive: boolean, textElement: HTMLTextAreaElement) {

    let markerLength = marker.length;

    let content = this.post.content;

    if(!isActive){
      let preText = content.substring(0, textElement.selectionStart);
      let selectedText = content.substring(textElement.selectionStart, textElement.selectionEnd);
      let postText = content.substring(textElement.selectionEnd);
      this.post.content = `${preText}${marker}${selectedText}${marker}${postText}`;

      this.changeSelection(textElement, markerLength)

    } else {
      let prevMarker = content.lastIndexOf(marker, textElement.selectionStart);
      let nextMarker = content.indexOf(marker, textElement.selectionEnd);

      if(prevMarker != -1 && nextMarker != -1) {
        let preText = content.substring(0, prevMarker);
        let middleText = content.substring(prevMarker + markerLength, nextMarker);
        let postText = content.substring(nextMarker + markerLength);

        this.post.content = `${preText}${middleText}${postText}`;
        this.changeSelection(textElement, -markerLength)
      }
    }
  }

  changeSelection(textElement: HTMLTextAreaElement, change: number, collapsingText: boolean = false){
    let currentSelectionStart = textElement.selectionStart + change;

    let currentSelectionEnd = collapsingText ? currentSelectionStart : textElement.selectionEnd + change;

    
    textElement.focus();
    setTimeout(() => textElement.setSelectionRange(currentSelectionStart, currentSelectionEnd, "forward"));
  }

  findListOfMarks(marker: string): number[] {
    let ret: number[] = [];

    for(let start = 0, append = this.post.content.indexOf(marker, start); append != -1; append = this.post.content.indexOf(marker, start)){
      ret.push(append);
      start += append + marker.length;
    }

    return ret;
  }

  callibrateState(){
    let textElement = this.retrieveElement();
    if(!textElement){
      return;
    }

    let b = this.findListOfMarks('**');
    let i = this.findListOfMarks('__');

    
    this.isBold = false;
    for(let index = 0; index < b.length - 1; index += 2){
      let lower = b[index];
      let upper = b[index + 1];

      if((textElement.selectionStart > lower + 1) && (textElement.selectionEnd <= upper)){
        this.isBold = true;
        break;
      }
    }

    this.isItalic = false;
    for(let index = 0; index < i.length - 1; index += 2){
      let lower = i[index];
      let upper = i[index + 1];

      if((textElement.selectionStart > lower) && (textElement.selectionEnd < upper)){
        this.isItalic = true;
        break;
      }
    }
  }

  onClickBold(){
    let textElement = this.retrieveElement();
    if(!textElement){
      return;
    }

    textElement.focus();
    this.toggleCodeStat('**', this.isBold, textElement);

    this.isBold = !this.isBold;
  }

  onClickItalic(){
    let textElement = this.retrieveElement();
    if(!textElement){
      return;
    }


    textElement.focus();
    this.toggleCodeStat('__', this.isItalic, textElement);

    this.isItalic = !this.isItalic;
  }

  onToggleGallery()
  {
    this.showGallery = !this.showGallery;
  }

  onClickPicture(){
    this.imageActivator.emit();
  }

  doPost() {

    if(!this.post.category){
      alert("Please Set a Category!");
      return;
    }

    this.post.owner = this.targetProfile;
    this.makePost.emit(this.post)
  }
}
