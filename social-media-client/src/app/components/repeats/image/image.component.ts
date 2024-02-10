import { style, trigger, state, transition, animate } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImageEntry, ImageMeta } from '../../../models/Image';
import { ImageMetaChecker, ImageService } from '../../../services/image.service';
import { ProfileService } from '../../../services/profile.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image.component.html',
  styleUrl: './image.component.css',
  animations: [
    trigger('onShowGallery', [
      state('doShow', style({ height: '80%', overflow: 'hidden'})),
      state('doHide', style({ height: '0px', overflow: 'hidden'})),
      transition('doShow => doHide', [ animate('0.33s')]),
      transition('doHide => doShow', [ animate('0.33s')])
    ]),
    trigger('onShowSelected', [
      state('doShow', style({ width: '100%', overflow: 'hidden'})),
      state('doHide', style({ width: '0px', overflow: 'hidden'})),
      transition('doShow => doHide', [ animate('0.33s')]),
      transition('doHide => doShow', [ animate('0.33s')])
    ]),
    trigger('xHover',[
      state('hover', style({background: 'rgba(255,0,0,1.0)'})),
      state('leave', style({background: 'rgba(0,0,0, 0.0'})),
      transition('hover => leave', [ animate('0.33s')]),
      transition('leave => hover', [ animate('0.33s')])
    ])
  ]
})
export class ImageComponent {
  searchTerm= "";

  doShow = false;

  useGallery=false;

  images: ImageEntry[] = [];

  selectedFile:File | undefined;
  selectedFileType: string| undefined;

  selectedImage: String | undefined;
  selectedImageId: String | undefined;



  imageName: String = "";
  imagePublic: boolean = false;
  imageTags: String = "";
  initialTags: String = "";

  defaultPageSize: number = 20;
  imagePageCount: number = 0;

  hasMore: boolean = false;


  permittedFileTypes = [
    "gif",
    "jpeg",
    "png",
    "svg",
    "webp"];

  uploadCheckers: Map<String, ImageMetaChecker> = new Map<String, ImageMetaChecker>();


  imageServer: string;

  xButtonHover = false;
  setHover(hover: boolean){
    this.xButtonHover = hover;
  }

  getImageData(id: String): String | undefined {
    for(let iEntry of this.images){
      if(iEntry.id === id){
        return iEntry.imageData;
      }
    }
    return undefined;
  }

  prepGallery(num: number){
    if(num < 0 || num >= this.selectionHandlers.length){ return; }

    this.doShow = true;

    this.currentHandler = this.selectionHandlers[num];

    this.images = [];
    this.imagePageCount = 0;
    this.hasMore = false;

    this.retrieveImages();
  }

  retrieveImages(){
    this.imageService.seekEntriesByOwner(this.imagePageCount, this.defaultPageSize).subscribe({
      next: (entries: ImageEntry[]) => {
        if(entries.length == this.defaultPageSize) {
          // There are still images that we can request
          this.hasMore = true;
          this.imagePageCount++;
        }
        this.images = this.images.concat(entries);
      }
    })
  }

  hideGallery(){
    this.doShow = false;
  }

  selectionHandlers: Function[] = [
    (s: String) => {  // Use this for setting Cover Photo
      let data = this.getImageData(s);
      if(data){
        this.profileService.setCoverPhoto(s);
        this.imageService.setCoverPhoto(s, false); // To-Do: Add Support for Brand Accounts
      }
    },
    (s: String) => {  // Use this for setting Profile Pic
      let data = this.getImageData(s);
      if(data){
        this.profileService.setProfilePhoto(s);
        this.imageService.setProfile(s, false); // To-Do: Add Support for Brand Accounts
      }
    },
    (s: String) => {  // Use this for selecting images for a post

        // To-Do: Figure out how this will work
    }
  ];

  currentHandler: Function | undefined;

  constructor(private imageService: ImageService, private profileService: ProfileService){
    this.imageServer = environment.image_service_url;
  }

  setUseGallery(ug: boolean){
    this.useGallery = ug;
  }

  // onNewFileSelected(event: any){

  //   this.imageName = "";

  //   this.selectedFile = event.target.files[0]
  //   console.log("File Selectd: " + this.selectedFile);
  //   if(!this.selectedFile)return;

  //   let t = this.selectedFile.type.toLowerCase().trim();
  //   console.log("File Type is " + this.selectedFile.type + " ("+ t +") and name is " + this.selectedFile.name);
  //   for(let possibleType of this.permittedFileTypes) {
  //     if(t == `image/${possibleType}`)
  //     {
  //       this.selectedFileType = possibleType;
  //       break;
  //     }
  //   }
  //   console.log("Selected File type is " + this.selectedFileType);
  // }

  

  uploadFile(){
    if(!this.selectedFileType || !this.selectedImage){
      console.log("File Type not detected! Cannot upload file!");
      return;
    }

    if(!this.currentHandler){
      console.log("Failed to retrieve Image Handler Function");
      return;
    }

    let captureHandler = this.currentHandler;

    let postHandler = (success: boolean, result: String) => {
      console.log("Image Response is " + success + " with a result of ", result);
      if(!success){
        alert(result);
      }
      else {

        let checkerSuccess = (meta: ImageMeta, id: String) => {
          if(meta.extraDetails?.isAdultContent) {
            alert("TrecApps has detected Adult Content in this image. We cannot show it!");
          } else {
            captureHandler(id);
          }
        }

        let checkerFailure = (message: String, id: String) => {
          alert(message);
          this.uploadCheckers.delete(id);
        }

        let checker = this.imageService.getMetaChecker(result, checkerSuccess, checkerFailure);
        this.uploadCheckers.set(result, checker);
        checker.start();
      }
    }
    

    this.imageService.postImage(this.selectedImage, this.selectedFileType, postHandler, this.imageName);
    
  }

  imageFromDevice(event: any){
    this.selectedFile = event.target.files[0]
    console.log("File Selectd: " + this.selectedFile);
    if(!this.selectedFile)return;

    this.imageName = this.selectedFile.name;

    let t = this.selectedFile.type.toLowerCase().trim();
    console.log("File Type is " + this.selectedFile.type + " ("+ t +") and name is " + this.selectedFile.name);
    for(let possibleType of this.permittedFileTypes) {
      if(t == `image/${possibleType}`)
      {
        this.selectedFileType = possibleType;
        break;
      }
    }
    console.log("Selected File type is " + this.selectedFileType);

    this.selectedFile?.arrayBuffer().then((value: ArrayBuffer)=> {
      let buffer = new Uint8Array(value);

      const STRING_CHAR = buffer.reduce((data, byte)=> {return data + String.fromCharCode(byte);}, '');

      let data = btoa(STRING_CHAR);

      this.selectedImage = `data:image/${this.selectedFileType};base64,${data}`;
      this.selectedImageId = undefined;
    });
    
  }

  selectImage(entry: ImageEntry){
    this.selectedImage = entry.imageData;
    this.selectedImageId = entry.id;
    this.imageName = entry.name ? entry.name : "";
    this.imageTags = entry.tags ? entry.tags : "";
    this.initialTags = this.imageTags;
  }

  updateTags(){
    
  }



}
