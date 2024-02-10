import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'htmlRemover',
  standalone: true
})
export class HtmlRemoverPipe implements PipeTransform {

  transform(value: string| undefined): string {
    return value ? value.replace(/<.*?>/g, "") : "";
  }

}
