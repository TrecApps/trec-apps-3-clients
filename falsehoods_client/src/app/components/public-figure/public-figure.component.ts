import { Component, OnInit } from '@angular/core';
import { FullMediaFalsehood, MediaFalsehood, MediaFalsehoodSearch } from 'src/app/models/media.falsehood';
import { PublicFalsehood, PublicFalsehoodSearch } from 'src/app/models/public.falsehood';
import { PublicFigure, PublicFigureEntry } from 'src/app/models/public.figure';
import { FalsehoodSetService } from 'src/app/services/falsehood-set.service';
import { ResourceSearchService } from 'src/app/services/resource-search.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-public-figure',
  templateUrl: './public-figure.component.html',
  styleUrls: ['./public-figure.component.css']
})
export class PublicFigureComponent implements OnInit {

  mainFigure: PublicFigureEntry | undefined;

  mode: Number = 0;

  figureList: PublicFigure[] = [];

  searchFalsehoods: PublicFalsehood[] = [];
  searchMediaFalsehoods: MediaFalsehood[] = [];

  searchText: String = "";

  searchFalsehoodObject = new PublicFalsehoodSearch();
  searchMediaObject = new MediaFalsehoodSearch();

  constructor(private resourceSearch: ResourceSearchService, private searchService: SearchService, private setFalsehoodService: FalsehoodSetService) { 
    this.mainFigure = undefined;
  }

  ngOnInit(): void {
  }

  onSearchUpdate(event:any){
    let p = this.resourceSearch.searchPublicFigures(event.target.value, (regions: PublicFigure[]) => this.figureList = regions);
  }

  getFigure(id: Number) {
    let p = this.resourceSearch.getPublicFigure(id, (figure: PublicFigureEntry) => this.mainFigure = figure);

    this.searchText = "";
  }

  setMode(m: Number) {
    this.mode = m;

    if(this.mode == 2 && this.mainFigure) {
      this.searchFalsehoodObject.official = this.mainFigure.figure;
      this.searchService.SearchPublicFalsehoods(this.searchFalsehoodObject, true, this.searchFalsehoods);
    }
    if(this.mode == 3 && this.mainFigure) {
      this.searchMediaObject.author = this.mainFigure.figure;
      this.searchService.SearchMediaFalsehoods(this.searchMediaObject, true, this.searchMediaFalsehoods);
    }

  }

  selectFalsehood(falsehood: PublicFalsehood) {
    this.setFalsehoodService.setPublicFalsehood(falsehood);
  } 
  selectMediaFalsehood(falsehood: MediaFalsehood) {
    this.setFalsehoodService.setMediaFalsehood(falsehood);
  }
}
