import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FullMediaFalsehood, MediaFalsehood, MediaFalsehoodSearch } from '../models/media.falsehood';
import { FullPublicFalsehood, PublicFalsehood, PublicFalsehoodSearch } from '../models/public.falsehood';

export class FullMediaFalsehoodWrapper {
  falsehood : FullMediaFalsehood | undefined;
}

export class FullPublicFalsehoodWrapper {
  falsehood : FullPublicFalsehood | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  baseUrl:string;
  constructor(private httpClient: HttpClient) {
    this.baseUrl = environment.falsehood_search_url;
   }

  SearchMediaFalsehoods(searchObj: MediaFalsehoodSearch, confirmed: boolean, results: Array<MediaFalsehood>) {
    this.httpClient.post(`${this.baseUrl}Media/${confirmed ? 'Confirmed' : 'Rejected'}`, searchObj).
    subscribe((entry : Object) => {
      if(entry instanceof MediaFalsehood) {
        results.push(entry);
      } else if(entry instanceof Array) {
        entry.forEach((subEntry : MediaFalsehood) => {
          results.push(subEntry);
        });
      }
    });
  }
  SearchPublicFalsehoods(searchObj: PublicFalsehoodSearch, confirmed: boolean, results: Array<PublicFalsehood>) {
    this.httpClient.post(`${this.baseUrl}Public/${confirmed ? 'Confirmed' : 'Rejected'}`, searchObj).
    subscribe((entry : Object) => {
      if(entry instanceof PublicFalsehood) {
        results.push(entry);
      } else if(entry instanceof Array) {
        entry.forEach((subEntry : PublicFalsehood) => {
          results.push(subEntry);
        });
      }
    });
  }

  SearchSubmittedMediaFalsehoods(size : Number | undefined, page: Number | undefined, results : Array<MediaFalsehood>) {
    this.httpClient.get(`${this.baseUrl}Media/SearchSubmitted?size=${size ? size : 20}&page=${page ? page : 0}`).
    subscribe((entry : Object) => {
      if(entry instanceof MediaFalsehood) {
        results.push(entry);
      } else if(entry instanceof Array) {
        entry.forEach((subEntry : MediaFalsehood) => {
          results.push(subEntry);
        });
      }
    });
  }
  
  SearchSubmittedPublicFalsehoods(size : Number | undefined, page: Number | undefined, results : Array<PublicFalsehood>) {
    this.httpClient.get(`${this.baseUrl}Public/SearchSubmitted?size=${size ? size : 20}&page=${page ? page : 0}`).
    subscribe((entry : Object) => {
      if(entry instanceof PublicFalsehood) {
        results.push(entry);
      } else if(entry instanceof Array) {
        entry.forEach((subEntry : PublicFalsehood) => {
          results.push(subEntry);
        });
      }
    });
  }

  RetrieveMediaFalsehood(id:number, callable: Function) {
    this.httpClient.get<FullMediaFalsehood>(`${this.baseUrl}Media/id/${id}`).pipe(take(1)).
    subscribe((entry : FullMediaFalsehood) => {
        callable(entry);
      });
  }
  
  RetrievePublicFalsehood(id:number, callable: Function) {
    this.httpClient.get<FullPublicFalsehood>(`${this.baseUrl}Public/id/${id}`).pipe(take(1)).
    subscribe((entry : Object) => {
        callable(entry);
      });
  }
}
