import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BrandInfo, BrandInfoContainer, ResourceMetaData } from '../models/Brands';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  updateObserve = {
    error: (error: Response | any) => { 
      alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      if(error?.status == 401 || error ?.status == 403) {
        this.authService.clearAuth();
      }
    }
  }

  searchByNameAndType(name:string, type:string, callable:Function){
    let observe = {
      next: (results: BrandInfo[]) => {
        callable(results);
      },
      error : this.updateObserve.error
    };
    console.log("Searching for " + name);
    this.httpClient.get<BrandInfo[]>(`${environment.resource_url}search/resourceByType/${name.replace(' ', '_').replace('?',"")}?type=${type}`).subscribe(observe);
  }

  searchByName(name: string, callable: Function) {
    
    let observe = {
      next: (results: BrandInfo[]) => {
        callable(results);
      },
      error : this.updateObserve.error
    };

    this.httpClient.get<BrandInfo[]>(`${environment.resource_url}search/resources/${name.replace(' ', '_').replace('?',"")}`).subscribe(observe);
  }

  list(callable: Function, page:number, size:number)
  {
    let observe = {
      next: (results: BrandInfo[]) => {
        callable(results);
      },
      error : this.updateObserve.error
    };

    this.httpClient.get<BrandInfo[]>(`${environment.resource_url}search/resourceList?all=false&page=${page}&size=${size}`).subscribe(observe);

  }

  populateBrand(container: BrandInfoContainer, id:string, callable:Function){
    let observe1 = {
      next: (result: BrandInfo) => {
        container.brandInfo = result;
        callable();
      },
      error : this.updateObserve.error
    }

    this.httpClient.get<BrandInfo>(`${environment.resource_url}search/resourceEntry/${id}`).subscribe(observe1);

    let observe2 = {
      next: (result: string) => {
        container.contents = result;
      },
      error : this.updateObserve.error
    }
    this.httpClient.get(`${environment.resource_url}search/resourceContent/${id}`, {responseType: 'text'}).subscribe(observe2);

    let observe3 = {
      next: (result: ResourceMetaData) => {
        container.metadata = result;
      },
      error : this.updateObserve.error
    }

    this.httpClient.get<ResourceMetaData>(`${environment.resource_url}search/resourceMetaData/${id}`).subscribe(observe3);
  }
}
