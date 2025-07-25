import moment from 'moment'
import CalendarDay from './calendarDay'
import ClockTime from './clockTime'

type casing = 'lowercase' | 'capitalized'
export default class DateUtils {
  static formattedDayOfWeek(inputDate: Date | string): string {
    let date: Date
    if (inputDate instanceof Date) {
      date = inputDate
    } else {
      date = new Date(inputDate)
    }
    return date.toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'Europe/London' })
  }

  // example output: 1:00pm on 12 April 2021
  static formattedDateTime(
    dateTime: Date | string,
    options: { month?: 'short' | 'long'; timeCasing?: casing } = { month: 'long', timeCasing: 'lowercase' },
  ): string {
    const nonNullableOptions = {
      month: options.month ? options.month : 'long',
      casing: options.timeCasing ? options.timeCasing : 'lowercase',
    }
    return `${this.formattedTime(dateTime, nonNullableOptions)} on ${this.formattedDate(dateTime, nonNullableOptions)}`
  }

  // Docs: https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style#dates
  // string input: 2021-06-02 from delius (i.e. serviceUser.dateOfBirth)
  // string input: 2021-06-02T00:30:00+01:00 from interventions
  // example output: 12 January 2021
  static formattedDate(
    date: CalendarDay | Date | string,
    options: { month: 'short' | 'long' } = { month: 'long' },
  ): string {
    let calendarDay: CalendarDay
    if (date instanceof CalendarDay) {
      calendarDay = date
    } else if (date instanceof Date) {
      calendarDay = CalendarDay.britishDayForDate(date)
    } else {
      calendarDay = CalendarDay.britishDayForDate(new Date(date))!
    }
    const format = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: options.month,
      year: 'numeric',
      timeZone: 'UTC',
    })
    return format.format(calendarDay.utcDate)
  }

  static dayOfWeek(date: CalendarDay): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[date.utcDate.getDay()]
  }

  // Docs: https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style#times
  // string input: 2021-06-02T00:30:00+01:00 or 2021-06-02T00:30:00
  // example output: 1:00pm
  static formattedTime(
    time: CalendarDay | ClockTime | Date | string,
    options: { casing: casing } = { casing: 'lowercase' },
  ): string {
    let clockTime: ClockTime
    if (time instanceof ClockTime) {
      clockTime = time
    } else if (time instanceof CalendarDay) {
      clockTime = ClockTime.britishTimeForDate(time.utcDate)
    } else if (time instanceof Date) {
      clockTime = ClockTime.britishTimeForDate(time)
    } else {
      clockTime = ClockTime.britishTimeForDate(new Date(time))
    }
    if (clockTime.twelveHourClockHour === 12 && clockTime.minute === 0 && clockTime.partOfDay === 'pm') {
      return options.casing === 'capitalized' ? 'Midday' : 'midday'
    }
    if (clockTime.twelveHourClockHour === 0 && clockTime.partOfDay === 'am') {
      if (clockTime.minute === 0) {
        return options.casing === 'capitalized' ? 'Midnight' : 'midnight'
      }
      return `12:${clockTime.minute.toString().padStart(2, '0')}am`
    }
    return `${clockTime.twelveHourClockHour}:${clockTime.minute.toString().padStart(2, '0')}${clockTime.partOfDay}`
  }

  // example output: 11:00am to 1:00pm
  static formattedTimeRange(
    startsAt: ClockTime | Date | string,
    endsAt: ClockTime | Date | string,
    options: { casing: casing } = { casing: 'lowercase' },
  ): string {
    return `${this.formattedTime(startsAt, options)} to ${this.formattedTime(endsAt)}`
  }

  static age(dateOfBirth: string): number {
    return moment().diff(dateOfBirth, 'years')
  }

  // calculate difference of just months between 2 dates
  // if the current date is 29/05/2025 and date of birth is 20/04/1984 output will be 1
  static ageMonths(dateOfBirth: string): number {
    const dateOfBirthMoment = moment(dateOfBirth)
    const years = moment().diff(dateOfBirthMoment, 'year')
    dateOfBirthMoment.add(years, 'years')
    return moment().diff(dateOfBirthMoment, 'months')
  }
}
