import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TableTemplate, Table } from 'src/app/models/table';
import { TableTemplateService } from 'src/app/services/table-template.service';
import { TableService } from 'src/app/services/table.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {

  tableService: TableService;
  templateService: TableTemplateService;

  templates: TableTemplate[] = [];

  viewing : Boolean = true;

  insertions: Map<String, any>[] = [];

  errorMessages: string[] = [];

  constructor(tableService: TableService, templateService: TableTemplateService, private router: Router) {
    this.tableService = tableService;
    this.templateService = templateService;

    

    router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
        let endEvent : NavigationEnd = event;
        if(endEvent.url == "/Table" && this.tableService.table?.id){
          this.tableService.refreshActiveTable();

          this.templateService.listTemplates((obj: TableTemplate[]) => this.templates = obj);
        }
      }
    })
  }


  create(){
    if(!this.tableService.table || !this.templateService.tableTemplate?.id) return;
    this.tableService.createTable(this.tableService.table, (worked: boolean, msg: string, oId: string | undefined) => {
      alert(msg);
      if(worked && oId && this.tableService.table){
        this.tableService.table.id = oId;
        this.tableService.refreshActiveTable();
        this.viewing = true;
      }
    })
  }

  prepareInsertion(){
    let newMap = new Map<String, any>();

    for(let field of this.templateService.tableTemplate.fields){
      newMap.set(field[0], null);
    }
    this.insertions.push(newMap);
  }

  onInsertionDataChanged(map: Map<String, any>, field: String, data:any){
    map.set(field, data.target.data);
  }

  performInsertions() {
    this.errorMessages = [];
    this.tableService.insert(this.insertions, (worked:boolean, msg: string) => {
      if(worked){
        alert(msg);
          this.tableService.refreshActiveTable();
          this.viewing = true;
          this.insertions = [];
      }else{
        alert(msg);
      }
    })
  }
}
