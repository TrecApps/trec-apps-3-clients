import { Component, OnInit } from '@angular/core';
import { BrandInfo, BrandInfoContainer, BrandInfoEntry, BrandReviewEntry, ResourceMetaData } from 'src/app/models/Brands';
import { BrandService } from 'src/app/services/brand.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit {

  constructor(private brandService: BrandService) { }

  brands: BrandInfo[] = [];

  searchMode = true;
  searchAll = false;
  searchName = "";
  usingNameSearch = true;

  page = 0;
  size = 20;

  mainBrand : BrandInfoContainer | undefined;
  editMode = false;
  newKey="";
  newValue="";

  metaDataComment = "";
  contentsComment = "";
  reviewComment = "";

  subjectType="";

  permittedFileTypes = [
    "gif",
    "jpeg",
    "png",
    "svg",
    "webp"];

  creatingNew = false;

  ngOnInit(): void {
  }

  searchByName(){
    console.log("Search by Name using " + this.searchName);
    this.brandService.searchByName(this.searchName, (res: BrandInfo[]) => {
      while(this.brands.pop());
      for(let brand of res){
        this.brands.push(brand);
      }
    }, this.searchAll);
  }

  searchByAll(){
    this.brandService.list((res: BrandInfo[]) => {
      while(this.brands.pop());
      for(let brand of res){
        this.brands.push(brand);
      }
    }, this.searchAll, this.page, this.size);
  }

  toggleSearchMode(){
    this.usingNameSearch = !this.usingNameSearch;
  }

  seekBrand(id:string){
    this.mainBrand = new BrandInfoContainer();
    this.brandService.populateBrand(this.mainBrand, id, () => {
      this.subjectType = this.mainBrand.brandInfo.resourceType;
    });
    this.searchMode = false;
  }

  prepSubmission(){
    this.searchMode = false;
    this.mainBrand = new BrandInfoContainer();
    this.mainBrand.brandInfo = new BrandInfo();
    this.mainBrand.contents = "";
    this.mainBrand.metadata = new ResourceMetaData();
    this.mainBrand.metadata.metadata = new Map();

    this.creatingNew = true;
  }

  submitNew(){
    let newEntry = new BrandInfoEntry();
    newEntry.contents = this.mainBrand.contents;
    newEntry.metaData = this.mainBrand.metadata;
    
    newEntry.name = this.mainBrand.brandInfo.name;
    newEntry.type = this.subjectType;

    this.brandService.submitResource(newEntry, () => {
      this.mainBrand = undefined;
      this.subjectType = "";
      this.creatingNew = false;
    });
  }

  revertToSearch(){
    this.searchMode = true;
  }

  toggleEditMode(){
    this.editMode = !this.editMode;
  }

  removeField(key:string){
    this.mainBrand.metadata.metadata[key] = undefined;
  }

  addField() {
    if(this.newKey && this.newValue)
    {
      this.mainBrand.metadata.metadata[this.newKey] = this.newValue;
      
    }
    this.newKey = this.newValue = "";
  }

  updateMetaData(){
    this.brandService.updateMetaData(this.mainBrand.metadata, this.mainBrand.brandInfo.id, this.metaDataComment);
    this.metaDataComment = "";
  }

  updateContents(){
    this.brandService.updateContents(this.mainBrand.contents, this.mainBrand.brandInfo.id, this.contentsComment);
    this.contentsComment = "";
  }

  updateName(){
    let reviewEntry = new BrandReviewEntry();
    reviewEntry.comment = this.mainBrand.brandInfo.name;
    reviewEntry.id = this.mainBrand.brandInfo.id;
    this.brandService.updateName(reviewEntry);
  }

  submitReview(approve:boolean){
    let reviewEntry = new BrandReviewEntry();
    reviewEntry.approve = approve;
    reviewEntry.comment = this.reviewComment;
    reviewEntry.id = this.mainBrand.brandInfo.id;
    this.brandService.review(reviewEntry);
  }

  selectProfileImage(event: any){
    let selectedVerfiyFile = event.target.files[0]
    console.log("File Selectd: " + selectedVerfiyFile);
    if(!selectedVerfiyFile)return;

    let t = selectedVerfiyFile.type.toLowerCase().trim();
    console.log("File Type is " + selectedVerfiyFile.type + " ("+ t +") and name is " + selectedVerfiyFile.name);

    let selectedVerifyFileType;

    for(let possibleType of this.permittedFileTypes) {
      if(t == `image/${possibleType}`)
      {
        selectedVerifyFileType = possibleType;
        break;
      }
    }

    if(!selectedVerifyFileType)return;

    selectedVerfiyFile.arrayBuffer().then((value: ArrayBuffer)=> {
      let buffer = new Uint8Array(value);

      const STRING_CHAR = buffer.reduce((data, byte)=> {return data + String.fromCharCode(byte);}, '');

      let data = window.btoa(STRING_CHAR);

      this.mainBrand.metadata.profileBase64 = `data:${selectedVerifyFileType};base64,${data}`;
    }
  );
  }

}
