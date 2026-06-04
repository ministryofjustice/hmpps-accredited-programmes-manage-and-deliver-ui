import DateFormatUtils from './dateFormatUtils'

describe('DateFormatUtils', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2026, 6, 6, 12, 0, 0, 0))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

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

    it('handles API timestamps with a space separator', () => {
      const result = DateFormatUtils.parseISODateToDate('2026-07-06 13:00:00.000000')
      expect(result).toEqual(new Date(2026, 6, 6, 0, 0, 0, 0))
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

    it('handles API timestamps with a space separator', () => {
      expect(DateFormatUtils.toDateOnlyISO('2026-07-06 13:00:00.000000')).toEqual('2026-07-06')
    })

    it('returns null for invalid formats', () => {
      expect(DateFormatUtils.toDateOnlyISO('invalid')).toBeNull()
      expect(DateFormatUtils.toDateOnlyISO('')).toBeNull()
    })
  })

  describe('isDateInPast', () => {
    it('returns true for past dates', () => {
      expect(DateFormatUtils.isDateInPast('5/7/2026')).toBe(true)
    })

    it('returns false for today', () => {
      expect(DateFormatUtils.isDateInPast('6/7/2026')).toBe(false)
    })

    it('returns false for future dates', () => {
      expect(DateFormatUtils.isDateInPast('7/7/2026')).toBe(false)
    })
  })

  describe('isDateToday', () => {
    it('returns true for today', () => {
      expect(DateFormatUtils.isDateToday('6/7/2026')).toBe(true)
    })

    it('returns false for past dates', () => {
      expect(DateFormatUtils.isDateToday('5/7/2026')).toBe(false)
    })

    it('returns false for future dates', () => {
      expect(DateFormatUtils.isDateToday('7/7/2026')).toBe(false)
    })
  })

  describe('hasTimePassedOnDate', () => {
    it('returns false if date is not today', () => {
      expect(DateFormatUtils.hasTimePassedOnDate('7/7/2026', 10, 0, 'AM')).toBe(false)
    })

    it('supports ISO timestamps for today', () => {
      expect(DateFormatUtils.hasTimePassedOnDate('2026-07-06 23:00:00.000000', 11, 59, 'PM')).toBe(false)
    })

    it('returns true if time has passed on today', () => {
      expect(DateFormatUtils.hasTimePassedOnDate('6/7/2026', 11, 59, 'AM')).toBe(true)
    })
  })

  describe('isSessionInPast', () => {
    it('returns true for past sessions', () => {
      expect(DateFormatUtils.isSessionInPast('5/7/2026', 10, 0, 'AM')).toBe(true)
    })

    it('returns false for future sessions', () => {
      expect(DateFormatUtils.isSessionInPast('7/7/2026', 10, 0, 'AM')).toBe(false)
    })

    it('checks time if session is today', () => {
      expect(DateFormatUtils.isSessionInPast('6/7/2026', 11, 59, 'PM')).toBe(false)
    })
  })

  describe('isSessionEnded', () => {
    it('returns true for sessions on past dates', () => {
      expect(DateFormatUtils.isSessionEnded('5/7/2026', 10, 0, 'AM')).toBe(true)
    })

    it('returns false for sessions on future dates', () => {
      expect(DateFormatUtils.isSessionEnded('7/7/2026', 10, 0, 'AM')).toBe(false)
    })

    it('returns true for sessions today when end time is before now', () => {
      expect(DateFormatUtils.isSessionEnded('6/7/2026', 11, 59, 'AM')).toBe(true)
    })

    it('returns false for sessions today when end time is after now', () => {
      expect(DateFormatUtils.isSessionEnded('6/7/2026', 12, 1, 'PM')).toBe(false)
    })

    it('returns false for sessions today when end time is exactly now', () => {
      expect(DateFormatUtils.isSessionEnded('6/7/2026', 12, 0, 'PM')).toBe(false)
    })
  })
})
