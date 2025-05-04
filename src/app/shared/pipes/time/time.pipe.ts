import { Pipe, PipeTransform } from '@angular/core';
import { getFormattedTime } from '../../../utils';

@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  transform(value: number) {
    return getFormattedTime(value);
  }
}
