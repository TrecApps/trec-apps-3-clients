import { Component, OnInit } from '@angular/core';
import { MediaFalsehood, MediaFalsehoodSearch } from 'src/app/models/media.falsehood';
import { MediaOutlet, MediaOutletEntry } from 'src/app/models/media.outlet';
import { ResourceSearchService } from 'src/app/services/resource-search.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-media-outlet',
  templateUrl: './media-outlet.component.html',
  styleUrls: ['./media-outlet.component.css']
})
export class MediaOutletComponent implements OnInit {
  mainOutlet: MediaOutletEntry | undefined;

  mode: Number = 0;

  outetList: MediaOutlet[] = [];

  searchMediaFalsehoods: MediaFalsehood[] = [];

  searchText: String = "";

  searchMediaObject = new MediaFalsehoodSearch();

  constructor(private resourceSearch: ResourceSearchService, private searchService: SearchService) { 
    this.mainOutlet = undefined;
  }

  ngOnInit(): void {
  }

  onSearchUpdate(event:any){
    let p = this.resourceSearch.searchPublicFigures(event.target.value, (regions: MediaOutlet[]) => this.outetList = regions);
  }

  getOutlet(id: Number) {
    let p = this.resourceSearch.getMediaOutlet(id, (figure: MediaOutletEntry) => this.mainOutlet = figure);

    this.searchText = "";
  }

  setMode(m: Number) {
    this.mode = m;

    if(this.mode == 3 && this.mainOutlet) {
      this.searchMediaObject.outlet = this.mainOutlet.outlet;
      this.searchService.SearchMediaFalsehoods(this.searchMediaObject, true, this.searchMediaFalsehoods);
    }

  }

  selectMediaFalsehood(falsehood: MediaFalsehood) {

  }
}
