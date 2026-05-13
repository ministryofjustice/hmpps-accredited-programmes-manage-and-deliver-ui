/**
 * Utilities for parsing and comparing dates in various formats (UK DD/MM/YYYY and ISO YYYY-MM-DD)
 */
export default class DateFormatUtils {
  /**
   * Parses a UK format date string (DD/MM/YYYY) to a Date object
   * Sets time to midnight (00:00:00)
   */
  static parseUKDateToDate(dateStr: string): Date | null {
    if (typeof dateStr !== 'string') {
      return null
    }

    const ukMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
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

    const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (!isoMatch) {
      return null
    }

    const [, year, month, day] = isoMatch
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

    // Already in ISO format
    const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (isoMatch) {
      const [, year, month, day] = isoMatch
      return `${year}-${month}-${day}`
    }

    // Parse UK format
    const ukMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
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
   * Checks if a time on a given date (in UK format) has already passed
   * Date should be today; returns false if date is not today
   */
  static hasTimePassedOnDate(dateStr: string, hour: number, minute: number, amOrPm: 'AM' | 'PM'): boolean {
    if (!DateFormatUtils.isDateToday(dateStr)) {
      return false
    }

    const date = DateFormatUtils.parseUKDateToDate(dateStr)
    if (!date) return false

    // Convert 12-hour format to 24-hour
    let hour24 = hour
    if (amOrPm === 'AM') {
      hour24 = hour === 12 ? 0 : hour
    } else {
      hour24 = hour === 12 ? 12 : hour + 12
    }

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
}
