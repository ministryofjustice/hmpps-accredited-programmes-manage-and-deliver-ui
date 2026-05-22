import DateFormatUtils from './dateFormatUtils'

describe('DateFormatUtils', () => {
  describe('parseUKDateToDate', () => {
    it('parses valid UK date format', () => {
      const result = DateFormatUtils.parseUKDateToDate('15/03/2021')
      expect(result).toEqual(new Date(2021, 2, 15, 0, 0, 0, 0))
    })

    it('handles single digit day and month', () => {
      const result = DateFormatUtils.parseUKDateToDate('5/3/2021')
      expect(result).toEqual(new Date(2021, 2, 5, 0, 0, 0, 0))
    })

    it('returns null for non-string input', () => {
      expect(DateFormatUtils.parseUKDateToDate(null as unknown as string)).toBeNull()
      expect(DateFormatUtils.parseUKDateToDate(123 as unknown as string)).toBeNull()
    })

    it('returns null for invalid format', () => {
      expect(DateFormatUtils.parseUKDateToDate('2021-03-15')).toBeNull()
      expect(DateFormatUtils.parseUKDateToDate('invalid')).toBeNull()
    })
  })

  describe('parseISODateToDate', () => {
    it('parses valid ISO date format', () => {
      const result = DateFormatUtils.parseISODateToDate('2021-03-15')
      expect(result).toEqual(new Date(2021, 2, 15, 0, 0, 0, 0))
    })

    it('handles ISO format with time component', () => {
      const result = DateFormatUtils.parseISODateToDate('2021-03-15T10:30:00')
      expect(result).toEqual(new Date(2021, 2, 15, 0, 0, 0, 0))
    })

    it('returns null for non-string input', () => {
      expect(DateFormatUtils.parseISODateToDate(null as unknown as string)).toBeNull()
    })

    it('returns null for invalid format', () => {
      expect(DateFormatUtils.parseISODateToDate('15/03/2021')).toBeNull()
    })
  })

  describe('parseDate', () => {
    it('parses UK date format', () => {
      const result = DateFormatUtils.parseDate('15/03/2021')
      expect(result).toEqual(new Date(2021, 2, 15, 0, 0, 0, 0))
    })

    it('parses ISO date format', () => {
      const result = DateFormatUtils.parseDate('2021-03-15')
      expect(result).toEqual(new Date(2021, 2, 15, 0, 0, 0, 0))
    })

    it('returns null if format is unrecognized', () => {
      expect(DateFormatUtils.parseDate('invalid')).toBeNull()
    })
  })

  describe('toDateOnlyISO', () => {
    it('converts UK date to ISO format', () => {
      expect(DateFormatUtils.toDateOnlyISO('15/03/2021')).toEqual('2021-03-15')
    })

    it('normalizes ISO date', () => {
      expect(DateFormatUtils.toDateOnlyISO('2021-03-15')).toEqual('2021-03-15')
    })

    it('handles ISO with time component', () => {
      expect(DateFormatUtils.toDateOnlyISO('2021-03-15T10:30:00')).toEqual('2021-03-15')
    })

    it('returns null for invalid formats', () => {
      expect(DateFormatUtils.toDateOnlyISO('invalid')).toBeNull()
      expect(DateFormatUtils.toDateOnlyISO('')).toBeNull()
    })
  })

  describe('isDateInPast', () => {
    it('returns true for past dates', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const dateStr = `${yesterday.getDate()}/${yesterday.getMonth() + 1}/${yesterday.getFullYear()}`
      expect(DateFormatUtils.isDateInPast(dateStr)).toBe(true)
    })

    it('returns false for today', () => {
      const today = new Date()
      const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`
      expect(DateFormatUtils.isDateInPast(dateStr)).toBe(false)
    })

    it('returns false for future dates', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const dateStr = `${tomorrow.getDate()}/${tomorrow.getMonth() + 1}/${tomorrow.getFullYear()}`
      expect(DateFormatUtils.isDateInPast(dateStr)).toBe(false)
    })
  })

  describe('isDateToday', () => {
    it('returns true for today', () => {
      const today = new Date()
      const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`
      expect(DateFormatUtils.isDateToday(dateStr)).toBe(true)
    })

    it('returns false for past dates', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const dateStr = `${yesterday.getDate()}/${yesterday.getMonth() + 1}/${yesterday.getFullYear()}`
      expect(DateFormatUtils.isDateToday(dateStr)).toBe(false)
    })

    it('returns false for future dates', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const dateStr = `${tomorrow.getDate()}/${tomorrow.getMonth() + 1}/${tomorrow.getFullYear()}`
      expect(DateFormatUtils.isDateToday(dateStr)).toBe(false)
    })
  })

  describe('hasTimePassedOnDate', () => {
    it('returns false if date is not today', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const dateStr = `${tomorrow.getDate()}/${tomorrow.getMonth() + 1}/${tomorrow.getFullYear()}`
      expect(DateFormatUtils.hasTimePassedOnDate(dateStr, 10, 0, 'AM')).toBe(false)
    })

    it('returns true if time has passed on today', () => {
      const now = new Date()
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()

      // Set check time to 1 minute ago
      let checkHour = currentHour
      let checkMinute = currentMinute - 1
      let checkAmPm: 'AM' | 'PM' = 'AM'

      if (checkMinute < 0) {
        checkMinute += 60
        checkHour -= 1
      }

      if (checkHour < 12 && checkHour !== 0) {
        checkAmPm = 'AM'
      } else {
        checkAmPm = 'PM'
      }

      // Convert to 12-hour format for the check
      let check12Hour = checkHour
      if (checkHour === 0) {
        check12Hour = 12
        checkAmPm = 'AM'
      } else if (checkHour > 12) {
        check12Hour = checkHour - 12
        checkAmPm = 'PM'
      } else if (checkHour === 12) {
        checkAmPm = 'PM'
      }

      const today = new Date()
      const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`

      // This should return true because the time is in the past
      expect(DateFormatUtils.hasTimePassedOnDate(dateStr, check12Hour, checkMinute, checkAmPm)).toBe(true)
    })
  })

  describe('isSessionInPast', () => {
    it('returns true for past sessions', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const dateStr = `${yesterday.getDate()}/${yesterday.getMonth() + 1}/${yesterday.getFullYear()}`
      expect(DateFormatUtils.isSessionInPast(dateStr, 10, 0, 'AM')).toBe(true)
    })

    it('returns false for future sessions', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const dateStr = `${tomorrow.getDate()}/${tomorrow.getMonth() + 1}/${tomorrow.getFullYear()}`
      expect(DateFormatUtils.isSessionInPast(dateStr, 10, 0, 'AM')).toBe(false)
    })

    it('checks time if session is today', () => {
      const today = new Date()
      const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`

      // Future time should not be in past
      expect(DateFormatUtils.isSessionInPast(dateStr, 11, 59, 'PM')).toBe(false)
    })
  })
})
