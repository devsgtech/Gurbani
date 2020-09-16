import { Pipe, PipeTransform } from '@angular/core';
import _ from 'lodash';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  transform(text: string = null, search = null): string {
    try {
      if (text && search ) {
        text = _.toString(text); // sometimes comes in as number
        search = _.trim(search);
        if (search.length > 0) {
          let pattern = _.trim(search).replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
          pattern = pattern.split(' ').filter((t) => {
            return t.length > 0;
          }).join('|');
          let regex = new RegExp(pattern, 'gi');

          text = text.replace(regex, (match) => `<mark>${match}</mark>`);
        }
      }
    }
    catch (exception) {
      console.error('error in highlight:', exception);
    }
    return text;
  }

}
