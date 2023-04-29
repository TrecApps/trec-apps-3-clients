import { Component } from '@angular/core';
import { FactCheckList, FactCheckRet, Factcheck, FactcheckSubmission, FactcheckUpdate } from 'src/app/models/Falsehood';
import { FactcheckService } from 'src/app/services/factcheck.service';

@Component({
  selector: 'app-factcheck',
  templateUrl: './factcheck.component.html',
  styleUrls: ['./factcheck.component.css']
})
export class FactcheckComponent {

  constructor(private factcheckService: FactcheckService){

  }

  // Search Functionality
  useCommonTags = true;
  tagString = "";
  nameString = ""

  usePage = 0;
  useSize = 20;

  // Host object
  factCheckList: Factcheck[] = []
  mainFactCheck: Factcheck | undefined;
  mainContents = "";

  // Edit Functionality
  inEditMode = false;
  titleEdited = false;
  titleCommented = "";
  tags = "";

  searchByTags(){
    this.factcheckService.searchFactchecksByTags(this.tagString, this.useCommonTags, this.usePage, this.useSize, (res:FactCheckList) => {
      this.factCheckList = res.results;
    });
  }

  searchByTerm(){
    this.factcheckService.searchFactchecksByTitle(this.nameString, this.usePage, this.useSize, (res:FactCheckList) => {
      this.factCheckList = res.results;
    });
  }

  clearList(){
    this.factCheckList = [];
  }

  enableEdit(){
    this.inEditMode = true;
  }

  onSelect(id:string){
    this.factcheckService.retrieveFactCheck(id, (res: FactCheckRet) => {
      this.mainFactCheck = res.factCheck;
      this.mainContents = res.content;
    })
  }

  prepSubmission(){
    this.mainFactCheck = new Factcheck();
    this.mainFactCheck.reviewStage = "SUBMITTED";
    this.mainContents = "";
    this.inEditMode = true;
  }

  clearMain() {
    this.mainContents = "";
    this.inEditMode = false;
    this.mainFactCheck = undefined;
  }

  submitNew(){
    let factcheckSubmission = new FactcheckSubmission();
    let clearedTags = this.tags.trim();
    factcheckSubmission.tags = clearedTags.length ? clearedTags.split('\n') : [];

    for(let rust = 0; rust < factcheckSubmission.tags.length; rust++){
      factcheckSubmission.tags[rust] = factcheckSubmission.tags[rust].trim();
    }

    factcheckSubmission.content = this.mainContents;
    factcheckSubmission.title = this.mainFactCheck.title;

    this.factcheckService.submitFactCheck(factcheckSubmission, () => {
      this.mainFactCheck = undefined;
      this.mainContents = "";
    })
  }

  updateTitle(){

    let factcheckUpdate = new FactcheckUpdate();
    factcheckUpdate.content = this.mainContents;
    factcheckUpdate.factCheck = this.mainFactCheck;
    // To-Do: Add Comment Support

    // End To-Do
    this.factcheckService.updateFactcheck(factcheckUpdate, ()=> {

    })

  }
}
