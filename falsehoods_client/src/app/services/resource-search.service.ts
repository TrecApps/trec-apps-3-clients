import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Institution, InstitutionEntry } from '../models/institution';
import { MediaOutlet, MediaOutletEntry } from '../models/media.outlet';
import { PublicFigure, PublicFigureEntry } from '../models/public.figure';
import { Region, RegionEntry } from '../models/region';


@Injectable({
  providedIn: 'root'
})
export class ResourceSearchService {

  constructor(private httpClient: HttpClient) { }

  async searchRegions(searchTerm: String, callable: Function)
  {
    let observe = {
      next: (response: Region[]) => { 
          callable(response);
        
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
        callable(false);
      }
    };

    await this.httpClient.get<Region[]>(environment.resource_url + `institutions/${searchTerm.replace(' ', '_')}`)
    .pipe(take(1)).subscribe(observe);
  }

  async getRegion(id: Number, callable: Function) {
    let observe = {
      next: (response: RegionEntry) => { 
          callable(response);
        
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
        callable(false);
      }
    };

    await this.httpClient.get<RegionEntry>(environment.resource_url + `region/${id}`)
    .pipe(take(1)).subscribe(observe);

  }

  async searchInstitutions(searchTerm: String, callable: Function){
    let observe = {
      next: (response: Institution[]) => { 
          callable(response);
        
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
        callable(false);
      }
    };

    await this.httpClient.get<Institution[]>(environment.resource_url + `institutions/${searchTerm.replace(' ', '_')}`)
    .pipe(take(1)).subscribe(observe);

  }

  async getInstitution(id: Number, callable: Function) {
    let observe = {
      next: (response: InstitutionEntry) => { 
          callable(response);
        
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
        callable(false);
      }
    };
    await this.httpClient.get<InstitutionEntry>(environment.resource_url + `institution/${id}`)
    .pipe(take(1)).subscribe(observe);
  }

  async searchPublicFigures(searchTerm: String, callable: Function) {
    let observe = {
      next: (response: PublicFigure[]) => { 
          callable(response);
        
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
        callable(false);
      }
    };

    await this.httpClient.get<PublicFigure[]>(environment.resource_url + `publicFigures/${searchTerm.replace(' ', '_')}`)
    .pipe(take(1)).subscribe(observe);
  }

  async getPublicFigure(id: Number, callable: Function) {
    let observe = {
      next: (response: PublicFigureEntry) => { 
          callable(response);
        
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
        callable(false);
      }
    };

    await this.httpClient.get<PublicFigureEntry>(environment.resource_url + `publicFigure/${id}`)
    .pipe(take(1)).subscribe(observe);
  }

  async searchMediaOutlets(searchTerm: String, callable: Function) {
    let observe = {
      next: (response: MediaOutlet[]) => { 
          callable(response);
        
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
        callable(false);
      }
    };

    await this.httpClient.get<MediaOutlet[]>(environment.resource_url + `mediaOutlets/${searchTerm.replace(' ', '_')}`)
    .pipe(take(1)).subscribe(observe);
  }

  async getMediaOutlet(id: Number, callable: Function) {
    let observe = {
      next: (response: MediaOutletEntry) => { 
          callable(response);
        
      },
      error: (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
        callable(false);
      }
    };

    await this.httpClient.get<MediaOutletEntry>(environment.resource_url + `mediaOutlet/${id}`)
    .pipe(take(1)).subscribe(observe);
  }
}
