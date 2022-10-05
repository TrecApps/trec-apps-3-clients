import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InstitutionEntry } from '../models/institution';
import { MediaOutletEntry } from '../models/mediaOutlet';
import { PublicFigureEntry } from '../models/publicFigure';
import { RegionEntry } from '../models/region';

@Injectable({
  providedIn: 'root'
})
export class ResourceUpdateService {

  observe = {
    next: () => { 
      alert("Sucessfully Updated Resource Entry!");
      
    },
    error: (error: Response | any) => { 
      alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
    }
  }

  constructor(private httpClient: HttpClient) { }

  updateRegion(region: RegionEntry) {
    let promise = (region.region.id == null) ? 
      (this.httpClient.post(environment.resource_url + "Update/Region", region)) :
      (this.httpClient.put(environment.resource_url + "Update/Region", region));
    
    promise.pipe(take(1)).subscribe(this.observe);
  }

  updateInstitution(inst: InstitutionEntry) {
    let promise = (inst.institution.id == null) ? 
      (this.httpClient.post(environment.resource_url + "Update/Institution", inst)) :
      (this.httpClient.put(environment.resource_url + "Update/Institution", inst));
    
      promise.pipe(take(1)).subscribe(this.observe);
  }

  updatePublicFigure(figure: PublicFigureEntry){
    let promise = (figure.figure?.id == null) ? 
      (this.httpClient.post(environment.resource_url + "Update/PublicFigure", figure)) :
      (this.httpClient.put(environment.resource_url + "Update/PublicFigure", figure));
    
      promise.pipe(take(1)).subscribe(this.observe);
  }

  updateMediaOutlet(outlet: MediaOutletEntry) {
    let promise = (outlet.outlet?.outletId == null) ? 
      (this.httpClient.post(environment.resource_url + "Update/MediaOutlet", outlet)) :
      (this.httpClient.put(environment.resource_url + "Update/MediaOutlet", outlet));
    
      promise.pipe(take(1)).subscribe(this.observe);
  }
}
