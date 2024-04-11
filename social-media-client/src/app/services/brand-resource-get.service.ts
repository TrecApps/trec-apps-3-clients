import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { BrandInfo, BrandInfoImg } from '../models/BrandInfo';
import { environment } from '../environments/environment';

export const BRAND_RESOURCE_TYPE = {
  PUBLIC_FIGURE: "PUBLIC_FIGURE",
  ARTIST: "ARTIST",
  MUSICIAN: "MUSICIAN",
  ACTOR: "ACTOR",
  POLITICIAN: "POLITICIAN",
  MEDIA_OUTLET: "MEDIA_OUTLET",
  STUDIO: "STUDIO",
  SHOW: "SHOW",
  REGION: "REGION",
  INSTITUTION: "INSTITUTION",
  SCHOOL: "SCHOOL",
  COLLEGE: "COLLEGE",
  ORGANIZATION: "ORGANIZATION",
  CONCEPT: "CONCEPT",
  LITERATURE: "LITERATURE",
  BOOK: "BOOK",
  FILM: "FILM",
  TAXONOMY: "TAXONOMY",
  ART: "ART",
  BRAND: "BRAND",
  DRAWING: "DRAWING",
  PAINTING: "PAINTING",
  SCULPTURE: "SCULPTURE",
  SONG: "SONG",
  SPECIES: "SPECIES",
  ANIMAL: "ANIMAL",
  PLANT: "PLANT",
  FOOD: "FOOD",
  CONTINENT: "CONTINENT",
  COUNTRY: "COUNTRY",
  BIOME: "BIOME",
  DEVICE: "DEVICE",
  MACHINE: "MACHINE",
  LANGUAGE: "LANGUAGE",
  RESTAURANT: "RESTAURANT",
  GAME: "GAME",
  BOARD_GAME: "BOARD_GAME",
  SPORT: "SPORT",
  CARD_GAME: "CARD_GAME",
  VIDEO_GAME: "VIDEO_GAME",
  APP: "APP"
}

const brandDatabaseScaffold: BrandInfoImg[] = [
  new BrandInfoImg(new BrandInfo("1", "Star Wars Episode III: Revenge of the Sith", BRAND_RESOURCE_TYPE.FILM)),
  new BrandInfoImg(new BrandInfo("2", "Star Wars Episode II: Attack of the Clones", BRAND_RESOURCE_TYPE.FILM)),
  new BrandInfoImg(new BrandInfo("3", "Harry Potter and the Prisoner of Azkaban", BRAND_RESOURCE_TYPE.FILM)),
  new BrandInfoImg(new BrandInfo("4", "Harry Potter and the Goblet of Fire", BRAND_RESOURCE_TYPE.FILM)),
  new BrandInfoImg(new BrandInfo("5", "Rogue One - A Star Wars Story", BRAND_RESOURCE_TYPE.FILM)),
  new BrandInfoImg(new BrandInfo("6", "North America", BRAND_RESOURCE_TYPE.CONTINENT)),
  new BrandInfoImg(new BrandInfo("7", "South America", BRAND_RESOURCE_TYPE.CONTINENT))
];

@Injectable({
  providedIn: 'root'
})
export class BrandResourceGetService {

  constructor(private client: HttpClient) {

  }

  getBrandsByName(name: string): Observable<BrandInfoImg[]>{
    return new Observable((observer: Subscriber<BrandInfoImg[]>)=> {
      observer.next(brandDatabaseScaffold.filter((bi: BrandInfoImg) => {
        return bi.brandInfo.name.includes(name);
      }));
      observer.complete();
    });

    //return this.client.get<BrandInfo[]>(`${environment.resource_service_url}search/resources/${name}`);
  }

  getBrandsByNameAndType(name: string, type: string): Observable<BrandInfoImg[]>{

    return new Observable((observer: Subscriber<BrandInfoImg[]>)=> {
      observer.next(brandDatabaseScaffold.filter((bi: BrandInfoImg) => {
        return bi.brandInfo.resourceTypePrimary == type && bi.brandInfo.name.includes(name);
      }));
      observer.complete();
    });


    // let params = new HttpParams().append("type", type);
    // return this.client.get<BrandInfo[]>(`${environment.resource_service_url}search/resourceByType/${name}`, {params});
  }


}
