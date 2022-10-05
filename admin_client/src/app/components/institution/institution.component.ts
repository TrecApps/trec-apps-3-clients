import { Component, OnInit } from '@angular/core';
import { Institution, InstitutionEntry } from 'src/app/models/institution';
import { SearchService } from 'src/app/services/search.service';
import { UpdateService } from 'src/app/services/update.service';

@Component({
  selector: 'app-institution',
  templateUrl: './institution.component.html',
  styleUrls: ['./institution.component.css']
})
export class InstitutionComponent implements OnInit {

  mainInstitution: InstitutionEntry | null;

  searchInstitution: Institution[];
  editMode: boolean;
  searchText:String;
  constructor(private search: SearchService, private update: UpdateService) {
    this.mainInstitution = null;
    this.searchInstitution = [];
    this.editMode = false;
    this.searchText = "";
   }

  ngOnInit(): void {
  }

  updateInst() {
    if(!this.mainInstitution){
      return;
    }

    this.update.updateInstitution(this.mainInstitution);
    this.mainInstitution = null;
  }

  async onSearchUpdate(event:any){
    this.search.searchInstitutions(event.target.value, (institutions: Institution[])=> {
      this.searchInstitution = institutions;
    })
  }

  initializeNew() {
    let reg = new InstitutionEntry();
    reg.contents = "";
    reg.institution = new Institution();
    reg.institution.id = null;
    this.editMode = false;
    
    this.mainInstitution = reg;
  }

  getInstitution(id: Number) {
    this.search.getInstitution(id, (institution: InstitutionEntry)=> {
      this.mainInstitution = institution;
      this.editMode = false;
    });

    this.searchText = "";
  }

  edit() {
    this.editMode = true;
  }
}
