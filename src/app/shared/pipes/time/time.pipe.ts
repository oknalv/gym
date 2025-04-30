import { Pipe, PipeTransform } from '@angular/core';
import { getFormattedTime, getHoursMinutesAndSeconds } from '../../../utils';

@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  transform(value: number, units = false) {
    return getFormattedTime(value, units);
  }
}
