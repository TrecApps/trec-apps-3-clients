import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { NavigationEnd, Route, Router } from '@angular/router';
import { Field, Table, TableTemplate } from 'src/app/models/table';
import { TableTemplateService } from 'src/app/services/table-template.service';
import { TableService } from 'src/app/services/table.service';

@Component({
  selector: 'app-table-template',
  templateUrl: './table-template.component.html',
  styleUrls: ['./table-template.component.css'],
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
export class TableTemplateComponent {

  templateService: TableTemplateService;
  tableService: TableService;

  currentFieldName: string = "";

  currentField: Field | undefined;

  numberBackup: number[] = [
    0,0,0,0
  ]

  tableList: Table[] = [];

  fieldUse: boolean[] = [
    false, false, false, false
  ]

  enumAdd: string = "";
  enumComp: boolean = true;
  showFields: boolean = true;

  fieldTypes = [
    {val: "INTEGER", show:"Integer", desc: "A while Number"},
    {val: "FLOAT", show: "Decimal Number", desc: "A number with a decial component"},
    {val: "STRING", show: "String", desc: "A String, or a sequence of characters."},
    {val: "ENUM", show: "Enumeration", desc: "A String with pre-selected possible values"},
    {val: "BOOL", show: "Boolean", desc: "A true or false value"},
  ]
  
  

  constructor(templateService: TableTemplateService, tableService: TableService, private router:Router){
    this.templateService = templateService;
    this.tableService = tableService;
    router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
        let endEvent : NavigationEnd = event;
        if(endEvent.url == "/Template" && this.templateService.tableTemplate?.id){
          this.tableService.listByTemplate((tables: Table[])=>{ this.tableList = tables}, this.templateService.tableTemplate.id);
        }
      }
    })
  }

  prepNewField(){
    this.currentField = new Field();
    this.currentFieldName = "";
    this.numberBackup = [
      0,0,0,0
    ]
  }



  checkEnum(){
    if(!this.currentField?.enumVals) return;

    this.enumComp = this.currentField.enumVals.includes(this.enumAdd);
  }

  addEnum(){
    if(!this.currentField ) return;
    if(!this.currentField.enumVals){
      this.currentField.enumVals = [];
    }
    this.currentField.enumVals
  }

  removeEnum(val: string) {
    if(!this.currentField?.enumVals) return;
    this.currentField.enumVals = this.currentField.enumVals.filter((value:string) => val != value);

  }

  addField(){
    if(!this.currentField || !this.currentFieldName) return;

    if(this.fieldUse[0]) this.currentField.min = this.numberBackup[0];
    if(this.fieldUse[1]) this.currentField.max = this.numberBackup[1];
    if(this.fieldUse[2]) this.currentField.fMin = this.numberBackup[2];
    if(this.fieldUse[3]) this.currentField.fMax = this.numberBackup[3];

    this.templateService.tableTemplate.fields.set(this.currentFieldName, this.currentField);

    this.currentField = undefined;
    this.currentFieldName = "";

    this.fieldUse = [false, false, false, false];
    this.numberBackup = [0,0,0,0];
  }

  submitTemplate(){
    this.templateService.createTemplate(this.templateService.tableTemplate, (worked: boolean, message: string) => {
      alert(message);
      if(worked) {
        this.router.navigate(["Home"]);
      }
    })
  }

  toggleTemplateShow() {
    this.showFields = !this.showFields;
  }

  editField(name:string, field: Field){
    this.currentField = field;
    this.currentFieldName = name;


    this.fieldUse[0] = (this.currentField.min != undefined);
    this.numberBackup[0] = this.currentField.min || 0;

    this.fieldUse[1] = (this.currentField.max != undefined);
    this.numberBackup[1] = this.currentField.max || 0;

    this.fieldUse[2] = (this.currentField.fMin != undefined);
    this.numberBackup[2] = this.currentField.fMin || 0;

    this.fieldUse[3] = (this.currentField.fMax != undefined);
    this.numberBackup[3] = this.currentField.fMax || 0;
  }

  removeField(name:string){
    this.templateService.tableTemplate.fields.delete(name);
  }

  drop(tab:Table){
    if(tab.id){
      this.tableService.drop(tab.id);
    }
  }

  truncate(tab:Table){
    if(tab.id){
      this.tableService.truncate(tab.id);
    }
  }

  viewTable(tab:Table){

  }

  setField(currentField: Field, event: any){
    currentField.type = event.target.value
    console.log("Field name is: ")
    console.log(event)
    console.log(currentField.type)
  }
}
