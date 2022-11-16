import { Component, OnInit } from '@angular/core';
import { Region, RegionEntry } from 'src/app/models/region';
import { AuthService } from 'src/app/services/auth.service';
import { ResourceUpdateService } from 'src/app/services/resource-update.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css']
})
export class RegionComponent implements OnInit {

  mainRegion: RegionEntry | null;

  searchRegion: Region[];
  editMode: boolean;
  searchText:String;
  authService: AuthService;
  constructor(private search: SearchService, private update: ResourceUpdateService, authService: AuthService) {
    this.mainRegion = null;
    this.searchRegion = [];
    this.editMode = false;
    this.searchText = "";
    this.authService = authService;
   }

  ngOnInit(): void {
  }

  updateReg() {
    if(!this.mainRegion){
      return;
    }

    this.update.updateRegion(this.mainRegion);
    this.mainRegion = null;
  }

  async onSearchUpdate(event:any){
    let p = this.search.searchRegions(event.target.value, (value: Region[]) => {
      this.searchRegion = value;
    });
  }

  doSearch() {
    this.search.searchRegionsList((value: Region[]) => {
      this.searchRegion = value;
    });
  }

  initializeNew() {
    let reg = new RegionEntry();
    reg.contents = "";
    reg.region = new Region();
    reg.region.id = null;
    this.editMode = false;
    
    this.mainRegion = reg;
  }

  getRegion(id: Number | null) {
    if(!id){
      return;
    }
    let p = this.search.getRegion(id, (value: RegionEntry) => {
      this.mainRegion = value;
      this.editMode = false;
    });

    this.searchText = "";
  }

  edit() {
    this.editMode = true;
  }
}
