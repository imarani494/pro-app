import Moment from 'moment';

class DateUtil {
  static isSameDay(tm: any, tm1: any = null) {
    if (tm1 && Moment(tm1).isValid()) {
      return Moment(tm1).isSame(tm, 'day');
    }
    return Moment().isSame(tm, 'day');
  }
  static isNextDay(tm: any) {
    return Moment().add(1, 'day').isSame(tm, 'day');
  }
  static addDays(tm: any, days: any) {
    return Moment(tm).add(days, 'day');
  }
  static getDisplayTime(dt: any, tmSw: boolean = true) {
    if (!tmSw) {
      return DateUtil.getDisplayDate(dt);
    }
    return Moment(dt).format('LT');
  }
  static getDisplayTime24hr(dt: any, tmSw: boolean = true) {
    if (!tmSw) {
      return DateUtil.getDisplayDate(dt);
    }
    return Moment(dt).format('HH:mm');
  }

  static getDisplayDateT(dt: any, tmSw: boolean = true) {
    if (!tmSw) {
      return DateUtil.getDisplayDate(dt);
    }
    return Moment(dt).format('LLLL');
  }
  static diffInSeconds(tm: any) {
    return Moment().diff(tm, 'seconds');
  }
  static getDisplayDate(tm: any) {
    return Moment(tm).format('ddd, D MMM, YYYY');
  }
  static getDisplayDateF1(tm: any) {
    return Moment(tm).format('DD/MM/YYYY');
  }
  static getShortDisplayDate(tm: any) {
    if (!tm || !Moment(tm).isValid()) {
      return '';
    }
    return Moment(tm).format('D MMM YYYY');
  }

  static getShortestDisplayDate(tm: any) {
    if (!tm || !Moment(tm).isValid()) {
      return '';
    }
    return Moment(tm).format('D MMM');
  }

  static getTime() {
    return new Date().getTime();
  }

  static fromNow(tm: any) {
    return Moment(tm).fromNow();
  }
  static isValid(dt: any) {
    return Moment(dt).isValid();
  }

  static getDateTime(dt: any) {
    if (!dt) {
      return DateUtil.getTime();
    }
    return new Date(dt).getTime();
  }
  static getTimeFromMins(durMin: any, hrS: any = '', mnS: any = '') {
    return (
      (durMin >= 60 ? Math.floor(durMin / 60) + (hrS ? hrS : 'h') + ' ' : '') +
      (durMin == 0 || durMin % 60 > 0 ? (durMin % 60) + (mnS ? mnS : 'm') : '')
    );
  }
  static getDateMonthTimeDayFormat(dateItem: any) {
    return Moment(dateItem).format('D MMM HH:mm');
  }
  static getTimeDateMonthFormat(dateItem: any) {
    return Moment(dateItem).format('HH:mm D MMM');
  }

  static getDayOfWeek(tm: any) {
    return Moment(tm).format('dddd');
  }
  static getDayOfWeekShort(tm: any) {
    return Moment(tm).format('ddd');
  }
  static getDateDifference = (arrival: string, departure: string) => {
    const arrivalDate = new Date(arrival);
    const departureDate = new Date(departure);

    const diffInMs = arrivalDate.getTime() - departureDate.getTime();
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  };

  static getMinDate = (daysFromToday: number = 0) => {
    return Moment().add(daysFromToday, 'days').format('YYYY-MM-DD');
  };

  static getMaxDate = (monthsFromToday: number = 12) => {
    return Moment().add(monthsFromToday, 'months').format('YYYY-MM-DD');
  };

  static formatDateToISO = (date: any) => {
    if (!date || !Moment(date).isValid()) {
      return '';
    }
    return Moment(date).format('YYYY-MM-DD');
  };

  static formatDate = (
    dateStr: string | Date,
    formatString: string = 'EE, d MMM yyyy',
  ): string => {
    if (!dateStr) return '';
    try {
      const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
      if (!date || !Moment(date).isValid()) {
        return '';
      }
      // Convert date-fns format tokens to Moment.js format tokens
      const momentFormat = formatString
        .replace(/EEEE/g, 'dddd') // Full weekday name
        .replace(/EEE/g, 'ddd') // Abbreviated weekday name
        .replace(/EE/g, 'ddd') // Abbreviated weekday name
        .replace(/E/g, 'ddd') // Abbreviated weekday name
        .replace(/dddd/g, 'dddd') // Full weekday name (already correct)
        .replace(/ddd/g, 'ddd') // Abbreviated weekday name (already correct)
        .replace(/dd/g, 'DD') // Day of month (2 digits)
        .replace(/d/g, 'D') // Day of month (1-2 digits)
        .replace(/MMMM/g, 'MMMM') // Full month name (already correct)
        .replace(/MMM/g, 'MMM') // Abbreviated month name (already correct)
        .replace(/MM/g, 'MM') // Month (2 digits) (already correct)
        .replace(/M/g, 'M') // Month (1-2 digits) (already correct)
        .replace(/yyyy/g, 'YYYY') // Full year (4 digits)
        .replace(/yy/g, 'YY') // Year (2 digits)
        .replace(/HH/g, 'HH') // 24-hour format (already correct)
        .replace(/H/g, 'H') // 24-hour format (0-23) (already correct)
        .replace(/hh/g, 'hh') // 12-hour format (already correct)
        .replace(/h/g, 'h') // 12-hour format (1-12) (already correct)
        .replace(/mm/g, 'mm') // Minutes (already correct)
        .replace(/m/g, 'm') // Minutes (already correct)
        .replace(/ss/g, 'ss') // Seconds (already correct)
        .replace(/s/g, 's'); // Seconds (already correct)

      return Moment(date).format(momentFormat);
    } catch (error) {
      return '';
    }
  };
}

export default DateUtil;
