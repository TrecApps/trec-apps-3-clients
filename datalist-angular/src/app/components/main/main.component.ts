import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Table, TableTemplate } from 'src/app/models/table';
import { TableTemplateService } from 'src/app/services/table-template.service';
import { TableService } from 'src/app/services/table.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [
    trigger('translate', [
      state('collapse', style({ height: '0px', overflow: 'hidden'})),
      state('expanded', style({ height: '*', overflow: 'hidden'})),
      transition('collapse => expanded', [ animate('0.33s')]),
      transition('expanded => collapse', [animate('0.33s')])
    ]),
    trigger('rotate', [
      state('collapse', style({ transform: 'rotate(180deg)'})),
      state('expanded', style({ transform: 'rotate(270deg)'})),
      transition('collapse => expanded', [ animate('0.33s')]),
      transition('expanded => collapse', [animate('0.33s')])
    ])
  ]
})
export class MainComponent {
  showTemplates = false;
  showTables = false;

  toggleShowTempates(){
    this.showTemplates = !this.showTemplates;
  }

  toggleShowTables(){
    this.showTables = !this.showTables;
  }

  templateList: TableTemplate[] = [];
  tableList: Table[] = [];

  constructor(private templateService: TableTemplateService, 
              private tableService: TableService,
              private router: Router){
    router.events.subscribe((event) => {
      if(!(event instanceof NavigationEnd)){
        return;
      }

      let endEvent :NavigationEnd = event;
      if(endEvent.url = "main") {
        templateService.listTemplates((templates: TableTemplate[]) => this.templateList = templates);
        tableService.list((tables: Table[]) => this.tableList = tables);
      }
    })
  }

  createTemplate(){
    this.templateService.setTemplate(new TableTemplate());
    this.router.navigate(["Template"])
  }

  editTemplate(template: TableTemplate){

  }

  deleteTemplate(template: TableTemplate) {

  }

  listTableByTemplate(id: string| undefined){
    if(!id){
      return;
    }
    this.tableService.listByTemplate((tables: Table[]) => {this.tableList = tables;}, id);
  }

  editTable(table: Table){
    
  }

  deleteTable(table: Table){

  }
}
