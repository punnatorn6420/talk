import { Pipe, PipeTransform } from '@angular/core';
import { DateTimeFormatMode, formatDateTime } from '../helper/date-time.helper';

@Pipe({
  name: 'appDateTime',
  standalone: true,
  pure: true,
})
export class DateTimePipe implements PipeTransform {
  transform(
    value?: string | Date | null,
    mode: DateTimeFormatMode = 'full',
    locale = 'en-GB',
    timeZone = 'Asia/Bangkok',
    emptyText = '-',
  ): string {
    return formatDateTime(value, {
      mode,
      locale,
      timeZone,
      emptyText,
    });
  }
}
