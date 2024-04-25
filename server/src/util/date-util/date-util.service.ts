import { Injectable } from '@nestjs/common';

@Injectable()
export class DateUtilService {
  static DAY = 1000 * 60 * 60 * 24;

  getDiff = (unit: number) => (a: Date | number, b: Date | number) => {
    const aUnix = typeof a === 'number' ? a : a.getTime();
    const bUnix = typeof b === 'number' ? b : b.getTime();
    return Math.floor((bUnix - aUnix) / unit);
  };

  getDiffDays = this.getDiff(DateUtilService.DAY);
}
