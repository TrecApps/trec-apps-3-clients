import { Component, OnInit } from '@angular/core';
import { MediaOutlet, MediaOutletEntry } from 'src/app/models/mediaOutlet';
import { AuthService } from 'src/app/services/auth.service';
import { ResourceUpdateService } from 'src/app/services/resource-update.service';
import { SearchService } from 'src/app/services/search.service';
import '@github/markdown-toolbar-element'


@Component({
  selector: 'app-outlet',
  templateUrl: './outlet.component.html',
  styleUrls: ['./outlet.component.css']
})
export class OutletComponent implements OnInit {

  mainOutlet: MediaOutletEntry | null;

  searchOutlet: MediaOutlet[];
  editMode: boolean;
  searchText:String;
  authService: AuthService;
  constructor(private search: SearchService, private update: ResourceUpdateService, authService: AuthService) {
    this.mainOutlet = null;
    this.searchOutlet = [];
    this.editMode = false;
    this.searchText = "";
    this.authService = authService;
   }

  ngOnInit(): void {
  }

  updateOut() {
    if(!this.mainOutlet){
      return;
    }

    this.update.updateMediaOutlet(this.mainOutlet);
    this.mainOutlet = null;
  }

  async onSearchUpdate(event:any){
    this.search.searchMediaOutlets(event.target.value, (outlets: MediaOutlet[])=> {
      this.searchOutlet = outlets;
    });
  }

  doSearch() {
    this.search.searchMediaOutletsList((outlets: MediaOutlet[])=> {
      this.searchOutlet = outlets;
    });
  }

  initializeNew() {
    let reg = new MediaOutletEntry();
    reg.text = "";
    reg.outlet = new MediaOutlet();
    reg.outlet.outletId = undefined;
    this.editMode = false;
    
    this.mainOutlet = reg;
  }

  getOutlet(id: Number | undefined) {
    if(!id){
      return;
    }
    this.search.getMediaOutlet(id, (outlet: MediaOutletEntry)=> {
      this.mainOutlet = outlet;
      this.editMode = false;
    });

    this.searchText = "";
  }

  edit() {
    this.editMode = true;
  }
}
