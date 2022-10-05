import { Component, OnInit } from '@angular/core';
import { PublicFigure, PublicFigureEntry } from 'src/app/models/publicFigure';
import { SearchService } from 'src/app/services/search.service';
import { UpdateService } from 'src/app/services/update.service';

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
  constructor(private search: SearchService, private update: UpdateService) {
    this.mainFigure = null;
    this.searchFigure = [];
    this.editMode = false;
    this.searchText = "";
   }

  ngOnInit(): void {
  }

  updateFig() {
    if(!this.mainFigure){
      return;
    }

    this.update.updatePublicFigure(this.mainFigure);
    this.mainFigure = null;
  }

  async onSearchUpdate(event:any){
    this.search.searchPublicFigures(event.target.value, (figures: PublicFigure[])=> {
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

  async getFigure(id: Number) {
    let p = this.search.getPublicFigure(id, (figure: PublicFigureEntry)=> {
      this.mainFigure = figure;
      this.editMode = false;
    });

    this.searchText = "";
  }

  edit() {
    this.editMode = true;
  }
}
