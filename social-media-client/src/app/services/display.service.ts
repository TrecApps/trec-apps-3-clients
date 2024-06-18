import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DisplayService {

  constructor() { }

  isMobile: boolean = true;

  screenHeight: number = 0;

  setMobile(im: boolean) {
    this.isMobile = im;
  }

  setScreenHeight(h: number){
    this.screenHeight = h;
  }
}
