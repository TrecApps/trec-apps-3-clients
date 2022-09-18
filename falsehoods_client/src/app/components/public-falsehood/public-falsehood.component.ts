import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FullPublicFalsehood, PublicFalsehood, PublicFalsehoodSearch, SearchPublicFalsehood } from 'src/app/models/public.falsehood';
import { PublicFigure } from 'src/app/models/public.figure';
import { Region } from 'src/app/models/region';
import { AuthService } from 'src/app/services/auth.service';
import { ResourceSearchService } from 'src/app/services/resource-search.service';
import { ReviewEntry, ReviewService } from 'src/app/services/review.service';
import { SearchService } from 'src/app/services/search.service';
import { SubmitService } from 'src/app/services/submit.service';
import { StringWrapper } from '../../../../../angular_common/Models/Common';
import '@github/markdown-toolbar-element';

@Component({
  selector: 'app-public-falsehood',
  templateUrl: './public-falsehood.component.html',
  styleUrls: ['./public-falsehood.component.css']
})
export class PublicFalsehoodComponent implements OnInit {

  search: PublicFalsehoodSearch; // main search object
  dateSearchMode:number = 0;
  authorList: PublicFigure[] = [];
  searchAuthor:string = "";
  publicFalsehoodEntry: FullPublicFalsehood | undefined;

  publicFalsehoods: PublicFalsehood[] = [];

  mainFalsehood: FullPublicFalsehood | undefined;
  tokenService: AuthService;

  createNew: boolean;
  doSearch:boolean;

  // Resources for creating new Falsehood
  newFalsehood: FullPublicFalsehood;
  stringWrapper = new StringWrapper;

  // Handling Submitted Falsehoods
  doSubmitted: boolean;
  submittedPage: number;
  submitSize: number;
  submitReason: string;
  @ViewChild('pfTagWarning') warningEl!: ElementRef;
  @ViewChild('pfNewSubmit')  submitEl!: ElementRef;
  constructor( private resourceSearch: ResourceSearchService,
    private falsehoodSearch: SearchService, private reviewService: ReviewService,
    private submitter: SubmitService, tokenService: AuthService) { 
    this.createNew = this.doSearch = false;
    this.search = new PublicFalsehoodSearch();

    this.doSubmitted = false;
    this.submitSize = 20;
    this.submittedPage = 0;

    this.submitReason = "";
    this.tokenService = tokenService;
    this.newFalsehood = new FullPublicFalsehood();
    this.newFalsehood.contents = "";
    this.newFalsehood.metadata = new PublicFalsehood();
  }

  ngOnInit(): void {
  }

  startSearch() {
    this.doSearch = true;
    this.doSubmitted = false;
  }

  prepNewFalsehood() {
    if(!this.newFalsehood) {
      this.newFalsehood = new FullPublicFalsehood();
      this.newFalsehood.contents = "";
      this.newFalsehood.metadata = new PublicFalsehood();
    }
  }

  startCreateNew() {
    this.doSearch = false;
    this.prepNewFalsehood();

    if(this.newFalsehood?.metadata){
      this.newFalsehood.metadata.status = 0;
      this.newFalsehood.metadata.tags = new String();
    }
    this.createNew = true;
  }

  startSubmittedSearch() {
    this.doSearch = false;
    this.doSubmitted = true;
  }

  getSubmittedFalsehoods(){
    this.falsehoodSearch.SearchSubmittedPublicFalsehoods(this.submitSize, this.submittedPage, this.publicFalsehoods);
  }

  FilterUndefined<T>(subject : T | undefined, fallback : T) : T {
    return subject ? subject : fallback;
  }

  Approve(app: string) {
    let formData = new ReviewEntry(this.FilterUndefined<string>(this.publicFalsehoodEntry?.metadata.id?.toString(), ''), this.submitReason);

    this.reviewService.ReviewPublicFalsehood(app, formData, this.stringWrapper);
  }


  submitSearch() {
    this.falsehoodSearch.SearchPublicFalsehoods(this.search, true, this.publicFalsehoods);
    this.search = new PublicFalsehoodSearch();
    this.doSearch = false;
  }

  onSearchAuthor(event:any){
    let p = this.resourceSearch.searchPublicFigures(event.target.value, (figures: PublicFigure[]) => this.authorList = figures);
  }

  setNewAuthor(out: PublicFigure| undefined) {
    this.prepNewFalsehood();
    if(this.newFalsehood){
      this.newFalsehood.metadata.official = out;
    }
  }

  setAuthor(out: PublicFigure | undefined) {
    this.search.official = out;
  }

  setDateSearchMode(val: number) {
    this.dateSearchMode = val;
  }

  selectPublicFalsehood(falsehood: PublicFalsehood) {
    if(falsehood.id) {
      this.falsehoodSearch.RetrievePublicFalsehood(falsehood.id, (entry: FullPublicFalsehood) => {
        this.publicFalsehoodEntry = entry;
      });
    }
  }

  inspectTagsField() {
    if(this.FilterUndefined<number>(this.newFalsehood?.metadata?.tags?.length, 0) > 400) {
      this.warningEl.nativeElement.hidden = false;
      this.submitEl.nativeElement.hidden = true;
    } else {
      this.warningEl.nativeElement.hidden = true;
      this.submitEl.nativeElement.hidden = false;
    }
  }

  submitNewFalsehod() {
    this.submitter.SubmitPublicEntry(this.newFalsehood, this.stringWrapper);
    this.stopCreateNew();
  }

  stopCreateNew() {
    this.prepNewFalsehood();
    this.createNew=false;
  }
}
