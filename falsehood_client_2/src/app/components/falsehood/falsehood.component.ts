import { Component } from '@angular/core';
import { BrandInfo, Record } from 'src/app/models/Brands';
import { ContentUpdate, FactCheckList, Factcheck, Falsehood, FalsehoodList, FalsehoodRet, FalsehoodSubmission } from 'src/app/models/Falsehood';
import { AuthService } from 'src/app/services/auth.service';
import { FactcheckService } from 'src/app/services/factcheck.service';
import { FalsehoodService } from 'src/app/services/falsehood.service';
import { SubjectService } from 'src/app/services/subject.service';
import '@github/markdown-toolbar-element';

@Component({
  selector: 'app-falsehood',
  templateUrl: './falsehood.component.html',
  styleUrls: ['./falsehood.component.css']
})
export class FalsehoodComponent {
  authService: AuthService;
  constructor(private falsehoodService: FalsehoodService, 
    private subjectService:SubjectService, 
    private factcheckService: FactcheckService,
    authService: AuthService) {
    this.authService = authService;
  }

  // Search Functionality
  isSearching = true;
  byTags = true;
  useCommonTags = true;
  usePage = 0;
  useSize = 20;
  searchTag = "";

  // Search and Main Falsehood
  mainFalsehood: Falsehood | undefined;
  mainContents = "";
  records: Record[] = [];
  falsehoodList: Falsehood[] = [];
  isEditing = false;
  tags = "";
  contentUpdateComment = "";
  metaDataUpdateComment = "";

  // Brand Searching
  brandType = "";
  brandTypeHumanReadable = "";
  brandField = "";
  brandList: BrandInfo[] = [];
  factList: Factcheck[] = [];
  brandPage = 0;
  brandSize = 20;

  prepNewFalsehood(){
    this.mainFalsehood = new Falsehood();
    this.isEditing = true;
    this.mainContents = "";
    this.tags = "";
    this.isSearching = false;
  }

  setSearchByFields(){
    this.isSearching = true;
    this.byTags = false;
    this.mainFalsehood = new Falsehood();
  }

  setSearchByTags(){
    this.isSearching = true;
    this.byTags = true;
    this.mainFalsehood = undefined;
  }

  returnToSearch(){
    if(this.byTags){
      this.setSearchByTags();
    }else {
      this.setSearchByFields();
    }
  }

  searchByFalsehoodField(){
    this.falsehoodService.searchFalsehoodsByProperties(this.mainFalsehood, this.usePage, this.useSize, (result: FalsehoodList) => {
      this.falsehoodList = result.results;
      if(this.falsehoodList.length){
        this.isSearching = false;
      }
    })
  }

  searchByTags(){
    this.falsehoodService.searchFalsehoodsByTags(this.searchTag, this.useCommonTags, this.usePage, this.useSize, (result: FalsehoodList) => {
      this.falsehoodList = result.results;
      if(this.falsehoodList.length){
        this.isSearching = false;
      }
    })
  }

  updateMetadata(){
    let comment = this.metaDataUpdateComment.trim();
    this.falsehoodService.updateMetadata(this.mainFalsehood, comment ? comment : null, () => {
      this.retrieveFalsehood(this.mainFalsehood.id, false);
    })
  }

  updateContents(){
    let contentUpdate = new ContentUpdate();
    contentUpdate.id = this.mainFalsehood.id;
    contentUpdate.content = this.mainContents;
    contentUpdate.comment = this.contentUpdateComment;
    this.falsehoodService.updateContents(contentUpdate, () => {
      this.retrieveFalsehood(this.mainFalsehood.id, true, false);
    })
  }

  submitNewFalsehood(){
    let falsehoodSubmission = new FalsehoodSubmission();
    falsehoodSubmission.content = this.mainContents;
    falsehoodSubmission.falsehood = this.mainFalsehood;
    let clearedTags = this.tags;
    falsehoodSubmission.tags = clearedTags.length ? clearedTags.split('\n') : [];

    for(let rust = 0; rust < falsehoodSubmission.tags.length; rust++){
      falsehoodSubmission.tags[rust] = falsehoodSubmission.tags[rust].trim();
    }
    this.falsehoodService.submitFalsehood(falsehoodSubmission,() =>{
      this.returnToSearch();
    })
  }

  retrieveFalsehood(id:string, updatecontent = true, updateMetadata=true){
    this.falsehoodService.retrieveFalsehood(id, (result: FalsehoodRet)=> {
      this.isSearching = false;
      this.isEditing = false;

      this.records = result.records;
      if(updatecontent)
        this.mainContents = result.contents;
      if(updateMetadata)
        this.mainFalsehood = result.falsehood;

      this.tags = "";

      for(let tag of result.tags){
        if(this.tags){
          this.tags = this.tags + '\n';
        }
        this.tags = this.tags + tag;
      }
    })
  }

  setSearchByBrandType(type: string, humanType: string){
    this.brandType = type;
    this.brandTypeHumanReadable = humanType;
  }

  searchBrandsByType(){
    console.log("BrandField is " + this.brandField);
    if(this.brandType == "FACT-CHECK"){
      this.factcheckService.searchFactchecksByTitle(this.brandField, this.brandPage, this.brandSize, (factCheckList: FactCheckList) => {
        this.factList = factCheckList.results;
        this.brandList = [];
      })
    } else {
      this.subjectService.searchByNameAndType(this.brandField, this.brandType, (results: BrandInfo[]) => {
        this.brandList = results;
        this.factList = [];
      })
    }
  }

  setBrand(brand:BrandInfo) {
    switch(this.brandType){
      case "PUBLIC_FIGURE":
        this.mainFalsehood.figure = brand;
        break;
      case "MEDIA_OUTLET":
        this.mainFalsehood.outlet = brand;
        break;
      case "INSTITUTION":
        this.mainFalsehood.institution = brand;
        break;
      case "REGION":
        this.mainFalsehood.region = brand;
        break;
      default:

        return;
    }
    this.factList = [];
    this.brandList = [];

    this.brandType = this.brandTypeHumanReadable = "";
  }

  setFactCheck(check: Factcheck){
    this.mainFalsehood.factCheck = check;
    this.factList = [];
    this.brandList = [];

    this.brandType = this.brandTypeHumanReadable = "";
  }
}
