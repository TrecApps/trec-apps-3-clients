import { Component, OnInit } from '@angular/core';
import { PublicFigure, PublicFigureEntry } from 'src/app/models/publicFigure';
import { AuthService } from 'src/app/services/auth.service';
import { ResourceUpdateService } from 'src/app/services/resource-update.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-figure',
  templateUrl: './figure.component.html',
  styleUrls: ['./figure.component.css']
})
export class FigureComponent implements OnInit {

  mainFigure: PublicFigureEntry | null;

  searchFigure: PublicFigure[];
  editMode: boolean;
  searchText:String;

  name: String;

  authService: AuthService;

  constructor(private search: SearchService, private update: ResourceUpdateService, authService: AuthService) {
    this.mainFigure = null;
    this.searchFigure = [];
    this.editMode = false;
    this.searchText = "";
    this.authService = authService;
    this.name = "";
   }

  ngOnInit(): void {
  }

  updateFig() {
    if(!this.mainFigure){
      return;
    }

    if(this.mainFigure.figure.id === undefined)
    {
      let namePieces = this.name.split(' ');

      switch(namePieces.length) {
        case 0:
          alert("Figure Must have a name!");
          return;
        case 1:
          this.mainFigure.figure.firstname = this.name.trim();
          break;
        case 2:
          this.mainFigure.figure.firstname = namePieces[0];
          this.mainFigure.figure.lastName = namePieces[1];
          break;
        default:
          this.mainFigure.figure.firstname = namePieces[0];
          this.mainFigure.figure.lastName = namePieces[namePieces.length - 1];
          this.mainFigure.figure.middleNames = namePieces[1];
          for(let Rust = 2; Rust < namePieces.length - 1; Rust++) {
            this.mainFigure.figure.middleNames += (" " + namePieces[Rust]);
          }
      }
    }
    this.update.updatePublicFigure(this.mainFigure);
    this.mainFigure = null;
  }

  async onSearchUpdate(event:any){
    this.search.searchPublicFigures(event.target.value, (figures: PublicFigure[])=> {
      this.searchFigure = figures;
    });
  }

  doSearch(){
    this.search.searchPublicFiguresList((figures: PublicFigure[])=> {
      this.searchFigure = figures;
    });
  }

  initializeNew() {
    let reg = new PublicFigureEntry();
    reg.text = "";
    reg.figure = new PublicFigure();
    reg.figure.id = undefined;
    this.editMode = false;
    
    this.mainFigure = reg;
  }

  async getFigure(id: Number | undefined) {
    if(!id){return;}
    let p = this.search.getPublicFigure(id, (figure: PublicFigureEntry)=> {
      this.mainFigure = figure;
      this.editMode = false;
      this.name = figure.figure.firstname;
      if(figure.figure.middleNames) {
        this.name += ' ' + figure.figure.middleNames;
      }
      if(figure.figure.lastName) {
        this.name += ' ' + figure.figure.lastName;
      }
    });

    this.searchText = "";
  }

  edit() {
    this.editMode = true;
  }
}
