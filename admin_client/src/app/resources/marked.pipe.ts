import { Pipe, PipeTransform } from '@angular/core';

import {marked} from "marked";

// Idea for displaying mark up came from https://www.positronx.io/create-custom-markdown-pipe-in-angular-to-parse-html/


@Pipe({
  name: 'markdown'
})
export class MarkedPipe implements PipeTransform {

  transform(value: any, args?: any[]): any {
    if (value && value.length > 0) {
      return marked(value);
    }
    return value;
  }

}
