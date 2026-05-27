import DateUtils from './dateUtils'

/**
 * Utilities for parsing and comparing dates in various formats (UK DD/MM/YYYY and ISO YYYY-MM-DD)
 */
export default class DateFormatUtils {
  private static readonly isoDatePrefixPattern = /^\d{4}-\d{2}-\d{2}$/

  private static readonly ukDatePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/

  private static extractISODatePrefix(dateStr: string): string | null {
    const isoDatePrefix = dateStr.slice(0, 10)
    return DateFormatUtils.isoDatePrefixPattern.test(isoDatePrefix) ? isoDatePrefix : null
  }

  /**
   * Parses a UK format date string (DD/MM/YYYY) to a Date object
   * Sets time to midnight (00:00:00)
   */
  static parseUKDateToDate(dateStr: string): Date | null {
    if (typeof dateStr !== 'string') {
      return null
    }

    const ukMatch = dateStr.match(DateFormatUtils.ukDatePattern)
    if (!ukMatch) {
      return null
    }

    const [, day, month, year] = ukMatch
    const date = new Date(Number(year), Number(month) - 1, Number(day))
    date.setHours(0, 0, 0, 0)
    return date
  }

  /**
   * Parses an ISO format date string (YYYY-MM-DD) to a Date object
   * Sets time to midnight (00:00:00)
   */
  static parseISODateToDate(dateStr: string): Date | null {
    if (typeof dateStr !== 'string') {
      return null
    }

    const isoDatePrefix = DateFormatUtils.extractISODatePrefix(dateStr)
    if (!isoDatePrefix) {
      return null
    }

    const [year, month, day] = isoDatePrefix.split('-')
    const date = new Date(Number(year), Number(month) - 1, Number(day))
    date.setHours(0, 0, 0, 0)
    return date
  }

  /**
   * Attempts to parse a date string in either UK or ISO format
   * Returns null if format cannot be determined
   */
  static parseDate(dateStr: string): Date | null {
    let date = DateFormatUtils.parseISODateToDate(dateStr)
    if (date) return date

    date = DateFormatUtils.parseUKDateToDate(dateStr)
    if (date) return date

    return null
  }

  /**
   * Converts a date string (UK or ISO format) to YYYY-MM-DD format
   * Returns null if date cannot be parsed
   */
  static toDateOnlyISO(dateStr: string): string | null {
    if (!dateStr) return null

    const isoDatePrefix = DateFormatUtils.extractISODatePrefix(dateStr)
    if (isoDatePrefix) {
      return isoDatePrefix
    }

    const ukMatch = dateStr.match(DateFormatUtils.ukDatePattern)
    if (ukMatch) {
      const [, day, month, year] = ukMatch
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }

    return null
  }

  /**
   * Checks if a date (UK or ISO format) is in the past (before today at midnight)
   */
  static isDateInPast(dateStr: string): boolean {
    const date = DateFormatUtils.parseDate(dateStr)
    if (!date) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return date < today
  }

  /**
   * Checks if a date is today
   */
  static isDateToday(dateStr: string): boolean {
    const date = DateFormatUtils.parseDate(dateStr)
    if (!date) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return date.getTime() === today.getTime()
  }

  /**
   * Checks if a time on a given date (in UK or ISO format) has already passed
   * Date should be today; returns false if date is not today
   */
  static hasTimePassedOnDate(dateStr: string, hour: number, minute: number, amOrPm: 'AM' | 'PM'): boolean {
    if (!DateFormatUtils.isDateToday(dateStr)) {
      return false
    }

    const date = DateFormatUtils.parseDate(dateStr)
    if (!date) return false

    const { hour: hour24 } = DateUtils.convertTo24Hour(hour, minute, amOrPm)

    const timeOnDate = new Date(date)
    timeOnDate.setHours(hour24, minute, 0, 0)

    const now = new Date()
    return timeOnDate < now
  }

  /**
   * Checks if a session (with date and start time) is in the past
   * Accounts for both past dates and today's date if time has passed
   */
  static isSessionInPast(dateStr: string, hour: number, minute: number, amOrPm: 'AM' | 'PM'): boolean {
    const date = DateFormatUtils.parseDate(dateStr)
    if (!date) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // If date is before today, session is in the past
    if (date < today) {
      return true
    }

    // If date is in the future, session is not in the past
    if (date > today) {
      return false
    }

    // Date is today - check if start time has passed
    return DateFormatUtils.hasTimePassedOnDate(dateStr, hour, minute, amOrPm)
  }

  /**
   * Checks if a session (with date and end time) has ended
   * Returns true if the end time has already passed
   * Used to prevent modifications to completed sessions
   */
  static isSessionEnded(dateStr: string, hour: number, minute: number, amOrPm: 'AM' | 'PM'): boolean {
    const date = DateFormatUtils.parseDate(dateStr)
    if (!date) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // If date is before today, session has already ended
    if (date < today) {
      return true
    }

    // If date is in the future, session has not ended
    if (date > today) {
      return false
    }

    // Date is today - check if end time has passed
    return DateFormatUtils.hasTimePassedOnDate(dateStr, hour, minute, amOrPm)
  }
}
