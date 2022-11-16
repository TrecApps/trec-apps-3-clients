import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Institution, InstitutionEntry } from '../models/institution';
import { MediaOutlet, MediaOutletEntry } from '../models/mediaOutlet';
import { PublicFigure, PublicFigureEntry } from '../models/publicFigure';
import { Region, RegionEntry } from '../models/region';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private httpClient: HttpClient) { }

  searchRegions(searchTerm: String, callable: Function)
  {
    let observe = {
      next: (response: Region[]) => { 
        callable(response);
        
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    }
    this.httpClient.get<Region[]>(environment.resource_url + `search/regions/${searchTerm.replace(' ', '_')}`).pipe(take(1)).subscribe(observe);
  }

  searchRegionsList(callable: Function)
  {
    let observe = {
      next: (response: Region[]) => { 
        callable(response);
        
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    }
    this.httpClient.get<Region[]>(environment.resource_url + `search/regionsList`).pipe(take(1)).subscribe(observe);
  }

  getRegion(id: Number, callable: Function) {
    let observe = {
      next: (response: RegionEntry) => { 
        callable(response);
        
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    }
    this.httpClient.get<RegionEntry>(environment.resource_url + `search/region/${id}`).pipe(take(1)).subscribe(observe);
  }

  searchInstitutions(searchTerm: String, callable: Function)
  {
    let observe = {
      next: (response: Institution[]) => { 
        callable(response);
        
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    }
    this.httpClient.get<Institution[]>(environment.resource_url + `search/institutions/${searchTerm.replace(' ', '_')}`).pipe(take(1)).subscribe(observe);
  }

  searchInstitutionsList(callable: Function)
  {
    let observe = {
      next: (response: Institution[]) => { 
        callable(response);
        
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    }
    this.httpClient.get<Institution[]>(environment.resource_url + `search/institutionList`).pipe(take(1)).subscribe(observe);
  }

  getInstitution(id: Number, callable: Function) {
    let observe = {
      next: (response: InstitutionEntry) => { 
        callable(response);
        
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    }
    this.httpClient.get<InstitutionEntry>(environment.resource_url + `search/institution/${id}`).pipe(take(1)).subscribe(observe);
  }

  searchMediaOutlets(searchTerm: String, callable: Function)
  {
    let observe = {
      next: (response: MediaOutlet[]) => { 
        callable(response);
        
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    }
    this.httpClient.get<MediaOutlet[]>(environment.resource_url + `search/mediaOutlets/${searchTerm.replace(' ', '_')}`).pipe(take(1)).subscribe(observe);
  }
  searchMediaOutletsList(callable: Function)
  {
    let observe = {
      next: (response: MediaOutlet[]) => { 
        callable(response);
        
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    }
    this.httpClient.get<MediaOutlet[]>(environment.resource_url + `search/mediaOutletsList`).pipe(take(1)).subscribe(observe);
  }

  getMediaOutlet(id: Number, callable: Function) {
    let observe = {
      next: (response: MediaOutletEntry) => { 
        callable(response);
        
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    }
    this.httpClient.get<MediaOutletEntry>(environment.resource_url + `search/mediaOutlet/${id}`).pipe(take(1)).subscribe(observe);
  }

  searchPublicFigures(searchTerm: String, callable: Function)
  {
    let observe = {
      next: (response: PublicFigure[]) => { 
        callable(response);
        
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    }
    this.httpClient.get<PublicFigure[]>(environment.resource_url + `search/publicFigures/${searchTerm.replace(' ', '_')}`).pipe(take(1)).subscribe(observe);
  }

  searchPublicFiguresList(callable: Function)
  {
    let observe = {
      next: (response: PublicFigure[]) => { 
        callable(response);
        
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    }
    this.httpClient.get<PublicFigure[]>(environment.resource_url + `search/publicFiguresList`).pipe(take(1)).subscribe(observe);
  }

  getPublicFigure(id: Number, callable: Function) {
    let observe = {
      next: (response: PublicFigureEntry) => { 
        callable(response);
        
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
      }
    }
    this.httpClient.get<PublicFigureEntry>(environment.resource_url + `search/publicFigure/${id}`).pipe(take(1)).subscribe(observe);
  }
}
