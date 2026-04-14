import GroupDaysTimesUtils from './groupDaysTimesUtils'

describe('GroupDaysTimesUtils', () => {
  describe('formatTime', () => {
    it('formats 12:00pm as "midday"', () => {
      expect(GroupDaysTimesUtils.formatTime(12, 0, 'pm')).toEqual('midday')
    })

    it('formats 12:00am as "midnight"', () => {
      expect(GroupDaysTimesUtils.formatTime(12, 0, 'am')).toEqual('midnight')
    })

    it('formats times with zero minutes without colon', () => {
      expect(GroupDaysTimesUtils.formatTime(9, 0, 'AM')).toEqual('9am')
      expect(GroupDaysTimesUtils.formatTime(1, 0, 'PM')).toEqual('1pm')
    })

    it('formats times with non-zero minutes with colon', () => {
      expect(GroupDaysTimesUtils.formatTime(9, 30, 'AM')).toEqual('9:30am')
      expect(GroupDaysTimesUtils.formatTime(2, 5, 'PM')).toEqual('2:05pm')
    })

    it('pads single digit minutes with leading zero', () => {
      expect(GroupDaysTimesUtils.formatTime(9, 5, 'AM')).toEqual('9:05am')
      expect(GroupDaysTimesUtils.formatTime(3, 1, 'PM')).toEqual('3:01pm')
    })

    it('formats 12:30pm correctly (not midday)', () => {
      expect(GroupDaysTimesUtils.formatTime(12, 30, 'PM')).toEqual('12:30pm')
    })

    it('formats 12:30am correctly (not midnight)', () => {
      expect(GroupDaysTimesUtils.formatTime(12, 30, 'AM')).toEqual('12:30am')
    })
  })

  describe('addTwoAndHalfHours', () => {
    it('adds 2.5 hours crossing from AM to PM', () => {
      const result = GroupDaysTimesUtils.addTwoAndHalfHours(10, 0, 'AM')
      expect(result).toEqual({ endHour12: 12, endMinutes: 30, endAmOrPm: 'pm' })
    })

    it('adds 2.5 hours with existing minutes', () => {
      const result = GroupDaysTimesUtils.addTwoAndHalfHours(9, 30, 'AM')
      expect(result).toEqual({ endHour12: 12, endMinutes: 0, endAmOrPm: 'pm' })
    })

    it('adds 2.5 hours crossing from PM to AM (next day)', () => {
      const result = GroupDaysTimesUtils.addTwoAndHalfHours(10, 0, 'PM')
      expect(result).toEqual({ endHour12: 12, endMinutes: 30, endAmOrPm: 'am' })
    })

    it('adds 2.5 hours to 12:00 PM (midday)', () => {
      const result = GroupDaysTimesUtils.addTwoAndHalfHours(12, 0, 'PM')
      expect(result).toEqual({ endHour12: 2, endMinutes: 30, endAmOrPm: 'pm' })
    })

    it('adds 2.5 hours to 12:00 AM (midnight)', () => {
      const result = GroupDaysTimesUtils.addTwoAndHalfHours(12, 0, 'AM')
      expect(result).toEqual({ endHour12: 2, endMinutes: 30, endAmOrPm: 'am' })
    })

    it('adds 2.5 hours with minutes that sum to exact hour', () => {
      const result = GroupDaysTimesUtils.addTwoAndHalfHours(1, 30, 'PM')
      expect(result).toEqual({ endHour12: 4, endMinutes: 0, endAmOrPm: 'pm' })
    })
  })

  describe('sentenceCase', () => {
    it('converts first letter to uppercase and rest to lowercase', () => {
      expect(GroupDaysTimesUtils.sentenceCase('hello')).toEqual('Hello')
      expect(GroupDaysTimesUtils.sentenceCase('HELLO')).toEqual('Hello')
      expect(GroupDaysTimesUtils.sentenceCase('HeLLo')).toEqual('Hello')
    })

    it('handles multi-word strings (only first letter capitalized)', () => {
      expect(GroupDaysTimesUtils.sentenceCase('hello world')).toEqual('Hello world')
      expect(GroupDaysTimesUtils.sentenceCase('HELLO WORLD')).toEqual('Hello world')
    })

    it('returns empty string for undefined', () => {
      expect(GroupDaysTimesUtils.sentenceCase(undefined)).toEqual('')
    })

    it('returns empty string for empty string', () => {
      expect(GroupDaysTimesUtils.sentenceCase('')).toEqual('')
    })

    it('handles strings with numbers', () => {
      expect(GroupDaysTimesUtils.sentenceCase('test123')).toEqual('Test123')
      expect(GroupDaysTimesUtils.sentenceCase('123TEST')).toEqual('123test')
    })

    it('handles strings with special characters', () => {
      expect(GroupDaysTimesUtils.sentenceCase('hello-world')).toEqual('Hello-world')
      expect(GroupDaysTimesUtils.sentenceCase('test_value')).toEqual('Test_value')
    })
  })

  describe('formatStartDaysAndTimes', () => {
    it('formats multiple session slots', () => {
      const daysAndTimes = [
        {
          dayOfWeek: 'MONDAY' as 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY',
          hour: 9,
          minutes: 0,
          amOrPm: 'AM' as 'AM' | 'PM',
        },
        {
          dayOfWeek: 'WEDNESDAY' as 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY',
          hour: 2,
          minutes: 0,
          amOrPm: 'PM' as 'AM' | 'PM',
        },
      ]
      const result = GroupDaysTimesUtils.formatStartDaysAndTimes(daysAndTimes)
      expect(result).toEqual(['Mondays, 9am to 11:30am', 'Wednesdays, 2pm to 4:30pm'])
    })

    it('formats session starting at midday', () => {
      const daysAndTimes = [
        {
          dayOfWeek: 'THURSDAY' as 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY',
          hour: 12,
          minutes: 0,
          amOrPm: 'PM' as 'AM' | 'PM',
        },
      ]
      const result = GroupDaysTimesUtils.formatStartDaysAndTimes(daysAndTimes)
      expect(result).toEqual(['Thursdays, midday to 2:30pm'])
    })

    it('formats session starting at midnight', () => {
      const daysAndTimes = [
        {
          dayOfWeek: 'FRIDAY' as 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY',
          hour: 12,
          minutes: 0,
          amOrPm: 'AM' as 'AM' | 'PM',
        },
      ]
      const result = GroupDaysTimesUtils.formatStartDaysAndTimes(daysAndTimes)
      expect(result).toEqual(['Fridays, midnight to 2:30am'])
    })

    it('formats session crossing from AM to PM', () => {
      const daysAndTimes = [
        {
          dayOfWeek: 'SATURDAY' as 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY',
          hour: 10,
          minutes: 0,
          amOrPm: 'AM' as 'AM' | 'PM',
        },
      ]
      const result = GroupDaysTimesUtils.formatStartDaysAndTimes(daysAndTimes)
      expect(result).toEqual(['Saturdays, 10am to 12:30pm'])
    })

    it('formats session crossing from PM to AM (next day)', () => {
      const daysAndTimes = [
        {
          dayOfWeek: 'SUNDAY' as 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY',
          hour: 10,
          minutes: 0,
          amOrPm: 'PM' as 'AM' | 'PM',
        },
      ]
      const result = GroupDaysTimesUtils.formatStartDaysAndTimes(daysAndTimes)
      expect(result).toEqual(['Sundays, 10pm to 12:30am'])
    })

    it('formats session with end time that results in exact hour', () => {
      const daysAndTimes = [
        {
          dayOfWeek: 'TUESDAY' as 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY',
          hour: 1,
          minutes: 30,
          amOrPm: 'PM' as 'AM' | 'PM',
        },
      ]
      const result = GroupDaysTimesUtils.formatStartDaysAndTimes(daysAndTimes)
      expect(result).toEqual(['Tuesdays, 1:30pm to 4pm'])
    })

    it('formats session with single digit minutes padded correctly', () => {
      const daysAndTimes = [
        {
          dayOfWeek: 'MONDAY' as 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY',
          hour: 9,
          minutes: 5,
          amOrPm: 'AM' as 'AM' | 'PM',
        },
      ]
      const result = GroupDaysTimesUtils.formatStartDaysAndTimes(daysAndTimes)
      expect(result).toEqual(['Mondays, 9:05am to 11:35am'])
    })
  })
})
