import { Pipe, PipeTransform } from '@angular/core';

class ImageSlice {
  index: number = -1;
  slice: string | undefined;
}

class FormatMarker{
  isBold: boolean;
  index: number;
  constructor(isBold: boolean, index: number){
    this.isBold = isBold;
    this.index = index;
  }
}

@Pipe({
  name: 'tcFormatter',
  standalone: true
})
export class TcFormatterPipe implements PipeTransform {



  getImageSlice(value: string, startIndex: number): ImageSlice {
    let ret = new ImageSlice();
    let target = value.indexOf(":Image:", startIndex);

    if(target != -1){
      let targetSpace = target + 7;
      let charTarget = value.at(targetSpace)?.trim().length;
      if(charTarget && charTarget > 0) {
        // To-Do
      }
    }


    return ret;
  }

  filterBIInterlocking(value: string): string {
    //let markerStack: FormatMarker[] = [];

    let markerStack: boolean[] = [];

    let newValue = "";
    let sliceStart = 0;
    for(let c = 0; c < value.length - 1; c++)
    {
      let cSlice = value.slice(c, c + 2);
      switch(cSlice){
        case "__":
        case "**":
          let bVal = cSlice == "__";
          let appender = bVal ? "**__**" : "__**__";
          if(markerStack.length == 2){
            // Both are active, check to see if Bold one is
            if(markerStack[1] != bVal){
              // Italic is closing, need to add surrounding bold tags to remain HTML compliant
              newValue += value.substring(sliceStart, c) + appender;
              markerStack.shift();

              sliceStart = c + 2; // value index will be jumping ahead twice
            } else {
              // simply pop the value
              markerStack.pop();
            }
          }
          else if(markerStack.length == 1){
            if(markerStack[0] == bVal){ // The one Bold is closing, simply pop
              markerStack.pop();
            }
            else {
              // Need to add the Bold
              markerStack.push(bVal);
            }
          }
          else {// Must Be Zero, simply add the bold
            markerStack.push(bVal);
          }
          c++;        
      }
    }

    newValue += value.substring(sliceStart);

    return newValue;

    // value.s

    // for(let b = value.indexOf('__'), i = value.indexOf('**'); b != -1 || i != -1;){
    //   if(b == -1 || i < b){
    //     // Then we still have i
    //     markerStack.push(new FormatMarker(false, i));
    //     i = value.indexOf('**', i + 2);
    //   } else
    //   {
    //     // Then we still have b
    //     markerStack.push(new FormatMarker(true, b));
    //     b = value.indexOf('__', b + 2);
    //   }
    // }

    
  }

  transform(value: string): string {

    value = this.filterBIInterlocking(value);

    for(let start = value.indexOf('__'), end = value.indexOf('__', start + 2);
      end != -1;
      start = value.indexOf('__'), end = value.indexOf('__', start + 2)) {
      value = value.replace("__", "<b>").replace("__", "</b>");
    }
    for(let start = value.indexOf('**'), end = value.indexOf('**', start + 2);
      end != -1;
      start = value.indexOf('**'), end = value.indexOf('**', start + 2)) {
      value = value.replace("**", "<i>").replace("**", "</i>");
    }

    


    value = value.replaceAll("\n", "<br>");

    


    return value;
  }



}
