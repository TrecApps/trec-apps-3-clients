import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FullMediaFalsehood, MediaFalsehood, MediaFalsehoodRecords, MediaFalsehoodSearch } from 'src/app/models/media.falsehood';
import { MediaOutlet } from 'src/app/models/media.outlet';
import { PublicFigure } from 'src/app/models/public.figure';
import { AuthService } from 'src/app/services/auth.service';
import { ResourceSearchService } from 'src/app/services/resource-search.service';
import { ReviewService } from 'src/app/services/review.service';
import { SearchService } from 'src/app/services/search.service';
import { SubmitService } from 'src/app/services/submit.service';
import { StringWrapper } from '../../../../../angular_common/Models/Common';

@Component({
  selector: 'app-media-falsehood',
  templateUrl: './media-falsehood.component.html',
  styleUrls: ['./media-falsehood.component.css']
})
export class MediaFalsehoodComponent implements OnInit {

    // Resources for searching
    search: MediaFalsehoodSearch; // main search object
    dateSearchMode:number = 0;
    outletList: MediaOutlet[] = [];
    searchOutlet: string = "";
    authorList: PublicFigure[] = [];
    searchAuthor:string = "";
    mediaFalsehoodEntry: FullMediaFalsehood | undefined;

    mediaFalsehoods: MediaFalsehood[] = [];
  
    mainFalsehood: FullMediaFalsehood | undefined;
    tokenService:AuthService;
    
    createNew: boolean;
    doSearch:boolean;
  
      // Handling Submitted Falsehoods
      doSubmitted: boolean = false;
      submittedPage: number;
      submitSize: number;
      submitReason: string = "";
      newSeverity: number = 0;
      newType: number = 0;
  
    // Resources for creating new Falsehood
    newFalsehood: FullMediaFalsehood;

    stringWrapper = new StringWrapper;

  @ViewChild('fTagWarning')
  warningEl!: ElementRef;
  @ViewChild('fNewSubmit')
  submitEl!: ElementRef;
  constructor(private resourceSearch: ResourceSearchService,
     private falsehoodSearch: SearchService, private reviewService: ReviewService,
     private submitter: SubmitService, tokenService: AuthService) { 
    this.createNew = this.doSearch = false;
    this.search = new MediaFalsehoodSearch();

    this.tokenService = tokenService;
    this.submitSize = 20;
    this.submittedPage = 0;
    this.newFalsehood = new FullMediaFalsehood("", new MediaFalsehood(), undefined);
  }

  ngOnInit(): void {
  }

  startSearch() {
    this.doSearch = true;
    this.doSubmitted = false;
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
    this.falsehoodSearch.SearchSubmittedMediaFalsehoods(this.submitSize, this.submittedPage, this.mediaFalsehoods);
  }

  prepNewFalsehood() {
    if(!this.newFalsehood){
      this.newFalsehood = new FullMediaFalsehood("", new MediaFalsehood(), undefined);
    }
  }

  FilterUndefined<T>(subject : T | undefined, fallback : T) : T {
    return subject ? subject : fallback;
  }

  Approve(app: string) {
    let formData = new FormData();
    formData.append("Falsehood", this.FilterUndefined<string>(this.mediaFalsehoodEntry?.metadata.id?.toString(), ''));
    formData.append("Comment", this.submitReason);
    this.reviewService.ReviewMediaFalsehood(app, formData, this.stringWrapper);
  }

  onSearchAuthor(event:any){
    let p = this.resourceSearch.searchPublicFigures(event.target.value, (figures: PublicFigure[]) => this.authorList = figures);
  }

  setNewAuthor(out: PublicFigure| undefined, t: number) {
    this.prepNewFalsehood();
    if(t == 1 && this.newFalsehood) {
      this.newFalsehood.metadata.author1 = out;
    } else if(this.newFalsehood){
      this.newFalsehood.metadata.author2 = out;
    }
  }

  setAuthor(out: PublicFigure | undefined) {
    this.search.author = out;
  }

  submitSearch() {
    this.falsehoodSearch.SearchMediaFalsehoods(this.search, true, this.mediaFalsehoods);
    this.search = new MediaFalsehoodSearch();
    this.doSearch = false;
  }

  onSearchOutlet(event:any){
    this.resourceSearch.searchMediaOutlets(event.target.value,(outlets: MediaOutlet[])=> this.outletList = outlets);
  }

  setNewOutlet(out: MediaOutlet | undefined) {
    this.prepNewFalsehood();
    if(this.newFalsehood){
      this.newFalsehood.metadata.outlet = out;
    }
  }
  setOutlet(out: MediaOutlet | undefined) {
    this.search.outlet = out;
  }

  setDateSearchMode(val: number) {
    this.dateSearchMode = val;
  }

  selectMediaFalsehood(falsehood: MediaFalsehood) {
    if(falsehood.id) {
      this.falsehoodSearch.RetrieveMediaFalsehood(falsehood.id, (entry: FullMediaFalsehood) => {
        this.mainFalsehood = entry;
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
    this.newFalsehood.metadata.severity = this.newSeverity;
    this.submitter.SubmitMediaEntry(this.newFalsehood, this.stringWrapper);
    this.stopCreateNew();
  }

  stopCreateNew() {
    this.prepNewFalsehood();
    this.createNew=false;
  }
}
