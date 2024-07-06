import { style, trigger, state, transition, animate } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImageEntry, ImageMeta } from '../../../models/Image';
import { ImageMetaChecker, ImageService } from '../../../services/image.service';
import { ProfileService } from '../../../services/profile.service';
import { environment } from '../../../environments/environment';
import { ResponseObj } from '../../../models/ResponseObj';
import { ImageInsert } from '../post-edit/post-edit.component';
import { DisplayService } from '../../../services/display.service';
import { GlobalConstants } from '../../../common/GlobalConstants';

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image.component.html',
  styleUrl: './image.component.css',
  animations: [
    trigger('onShowGallery', [
      state('doShow', style({ height: '80%'})),
      state('doHide', style({ height: '0px'})),
      transition('doShow => doHide', [ animate('0.33s')]),
      transition('doHide => doShow', [ animate('0.33s')])
    ]),
    trigger('onShowSelected', [
      state('doShow', style({ width: '100%'})),
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

  @Input()
  mbLimit: number = 0;

  @Output()
  useImage = new EventEmitter<ImageInsert>();


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

    console.log("About to retrieve Images");

    this.retrieveImages();

    switch(num){
      case 1: this.executeMessage = "Set as Profile"; break;
      case 0: this.executeMessage = "Set as Cover Photo"; break;
      case 2: this.executeMessage = "Add to Post/Comment"; break;
    }

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
        this.profileService.setCoverPhoto(data);
         // To-Do: Add Support for Brand Accounts
        this.imageService.setCoverPhoto(s, false).subscribe({
          next: (ro: ResponseObj) => {
            alert("Successfully updated Cover Photo!");
            this.doShow = false;
          },
          error: (ro: ResponseObj) => {
            alert(ro.message);
          }
        });
      }
    },
    (s: String) => {  // Use this for setting Profile Pic
      let data = this.getImageData(s);

      console.log("Image ID for profile " + s + " yeilded " + data);

      if(data){
        this.profileService.setProfilePhoto(data);
        // To-Do: Add Support for Brand Accounts
        this.imageService.setProfile(s, false).subscribe({
          next: (ro: ResponseObj) => {
            alert("Successfully updated Profile!");
            this.doShow = false;
          },
          error: (ro: ResponseObj) => {
            alert(ro.message);
          }
        }); 
      }
    },
    (s: String) => {  // Use this for selecting images for a post

        let data = this.getImageData(s);

        console.log("Running Insertion Handler For Image");
        let imageInsert = data ? ImageInsert.generate(s.toString(), data.toString()) :
          ImageInsert.generate(s.toString());
        this.useImage.emit(imageInsert);
    }
  ];

  DoneViewingImage(execute: boolean){

    if(execute && this.currentHandler && this.selectedImageId){
      console.log("Executing Image Handler");
      this.currentHandler(this.selectedImageId)
    }

    this.selectedImage = undefined;
    this.selectedImageId = undefined;
  }

  currentHandler: Function | undefined;
  executeMessage: string = "";

  displayService: DisplayService;

  constructor(private imageService: ImageService, private profileService: ProfileService, ds: DisplayService){
    this.imageServer = environment.image_service_url;
    this.displayService = ds;
  }

  setUseGallery(ug: boolean){
    this.useGallery = ug;
  }
 

  uploadFile(){
    if(!this.selectedFileType || !this.selectedImage){
      console.log("File Type not detected! Cannot upload file!");
      return;
    }

    if(!this.currentHandler){
      console.log("Failed to retrieve Image Handler Function");
      return;
    }

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
            this.images = [];
            this.imagePageCount = 0;
            this.hasMore = false;
          }
          this.retrieveImages();
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

    if(this.mbLimit && this.selectedFile.size >= (this.mbLimit * GlobalConstants.bytesInMB) &&
      !confirm(`Your image exceeds the ${this.mbLimit} MB limit for moderation.\n You can still upload the image, but you'll need to contact\n
        the Administrator to use it as a Profile Image or Cover Photo`)){
          return;
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

  deleteImage(id: string){

    if(!confirm("Are you sure you want to delet this image?")) return;

    let targetId = id;
    let response = (value: ResponseObj) => {
      alert(value.message);
      if(value.status == 200){
        // Success, remove the local copy we have!
        this.images = this.images.filter((ie: ImageEntry) => {
          return ie.id != targetId
        })
      }
      this.DoneViewingImage(false);
    }
    this.imageService.deleteImage(id).subscribe({
      next: response,
      error: response
    })
  }


}
