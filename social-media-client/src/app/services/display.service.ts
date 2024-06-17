import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DisplayService {

  constructor() { }

  isMobile: boolean = true;

  setMobile(im: boolean) {
    this.isMobile = im;
  }
}
