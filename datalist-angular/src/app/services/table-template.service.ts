import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TableTemplate } from '../models/table';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
import { ResponseObj } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class TableTemplateService {

  constructor(private client: HttpClient, private auth: AuthService) {
    this.tableTemplate = new TableTemplate();
   }

  tableTemplate: TableTemplate;

  setTemplate(template: TableTemplate){
    this.tableTemplate = template;
  }


  createTemplate(template: TableTemplate, callable: Function) {

    let observe = {
      next: (obj: ResponseObj) => {
        callable(true, obj.message);
      },
      catch: (e: ResponseObj) => {
        callable(false, e.message);
      }
      
    }

    this.client.post<ResponseObj>(`${environment.datalist_url}templates/create`,
     template, {headers: this.auth.getHttpHeaders(true, true)}).subscribe(observe);
  }

  listTemplates(callable: Function) {
    let observe = {
      next: (obj: TableTemplate[]) => {
        callable(obj);
      }
    };

    this.client.get<TableTemplate[]>(`${environment.datalist_url}templates/list`,).subscribe(observe);
  }

  listTemplatesByUser(userId:string, callable: Function) {
    let observe = {
      next: (obj: TableTemplate[]) => {
        callable(obj);
      }
    };

    this.client.get<TableTemplate[]>(`${environment.datalist_url}templates/listFor?userId=${userId}`,).subscribe(observe);
  }
}
