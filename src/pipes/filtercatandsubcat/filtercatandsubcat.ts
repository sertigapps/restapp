import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FiltercatandsubcatPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'filtercatandsubcat',
})
export class FiltercatandsubcatPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: Array<any>,cat: Array<any>,scat:Array<any>) {
    if(cat && cat.length>1){
      return [];
    }
    else{
      return value;
    }
  }
}
