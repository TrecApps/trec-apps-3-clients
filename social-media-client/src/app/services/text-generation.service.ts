import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextGenerationService {

  storage: string[] = [];

  textSelection: string = "ABCDEFGHIJ_0123456789";

  lengthOfString: number = 8;

  constructor() { }

  makeRandom() {
    let text = "";
    for (let i = 0; i < this.lengthOfString; i++) {
      text += this.textSelection.charAt(Math.floor(Math.random() * this.textSelection.length));
    }
      return text;
  }

  generateText(): string {
    let ret = "";
    do{
      ret = this.makeRandom();
    } while(this.storage.includes(ret));

    this.storage.push(ret);
    return ret;
  }

  freeText(free: string){
    this.storage = this.storage.filter((s: string) => s !== free);
  }
}
