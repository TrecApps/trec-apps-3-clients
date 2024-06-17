import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Table, TableTemplate } from '../models/table';
import { ResponseObj } from '../models/response';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor(private client: HttpClient, private auth: AuthService) { }

  table: Table | undefined;
  

  setTable(t: Table){
    this.table = t;
  }

  createTable(table: Table, callable: Function){
    let observe = {
      next: (obj: ResponseObj) => {
        callable(true, obj.message, obj.objId);
      },
      catch: (e: ResponseObj) => {
        callable(false, e.message, e.objId);
      }
      
    }

    let formData = new FormData();
    formData.append("templateId", table.tableTemplateId as string);
    formData.append("name", table.name);
    if(table.description){
      formData.append("desc", table.description);
    }

    this.client.post<ResponseObj>(`${environment.datalist_url}Table/create`,
    formData, {headers: this.auth.getHttpHeaders(false, true)}).subscribe(observe);
  }
  
  insert(insertions: Map<String, any>[], callable:Function){


    if(!this.table?.id) return;

    let observe = {
      next: (obj: ResponseObj) => {
        callable(true, obj.message);
      },
      catch: (e: ResponseObj) => {
        callable(false, e.message);
      }
      
    }

    this.client.post<ResponseObj>(`${environment.datalist_url}Table/insert?tableId=${this.table.id}`, 
      insertions, {headers: this.auth.getHttpHeaders(false, true)}).subscribe(observe);
  }

  truncate(id:string){
    let observe = {
      next: () => {
        alert(`Table ${id} successfully truncated`);
      },
      catch: (e: ResponseObj) => {
        alert(`Failed to truncate table: ${e.message}`)
      }
      
    }

    this.client.put<ResponseObj>(`${environment.datalist_url}Table/truncate?tableId=${id}`,
      {headers: this.auth.getHttpHeaders(false, false)});
  }

  drop(id:string){
    let observe = {
      next: () => {
        alert(`Table ${id} successfully Dropped`);
      },
      catch: (e: ResponseObj) => {
        alert(`Failed to Drop table: ${e.message}`)
      }
      
    }

    this.client.delete<ResponseObj>(`${environment.datalist_url}Table/drop?tableId=${id}`,
      {headers: this.auth.getHttpHeaders(false, false)}).subscribe(observe);
  }

  list(callable: Function) {
    let observe = {
      next: (tables: Table[]) => {
        callable(tables);
      }
    }
    this.client.get<Table[]>(`${environment.datalist_url}Table/list`,
      {headers: this.auth.getHttpHeaders(false, false)}).subscribe(observe);
  }

  listByTemplate(callable:Function, id:string) {
    let observe = {
      next: (tables: Table[]) => {
        callable(tables);
      }
    }
    this.client.get<Table[]>(`${environment.datalist_url}Table/listByTemplate?templateId=${id}`,
      {headers: this.auth.getHttpHeaders(false, false)}).subscribe(observe);
  }
  
  refreshActiveTable() {
    if(this.table?.id){
      this.client.get<Table>(`${environment.datalist_url}Table/view?tableId=${this.table.id}`).subscribe({
        next: (tab: Table) => {
          this.table = tab;
        }
      })
    }
  }
}
