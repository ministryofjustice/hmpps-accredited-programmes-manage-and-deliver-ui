import GroupDetailsPresenter from './groupDetailsPresenter'
import GroupDetailsFactory from '../testutils/factories/groupDetailsFactory'

describe('GroupDetailsPresenter', () => {
  describe('isStartDateInThePast', () => {
    beforeEach(() => {
      // Mock the current date to be April 7, 2026
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2026-04-07T12:00:00Z'))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('returns true when the start date is in the past', () => {
      const groupDetails = GroupDetailsFactory.build({
        startDate: 'Wednesday 1 April 2026', // April 1, 2026 is before April 7, 2026
      })
      const presenter = new GroupDetailsPresenter(groupDetails)

      expect(presenter.isStartDateInThePast).toBe(true)
    })

    it('returns false when the start date is today', () => {
      const groupDetails = GroupDetailsFactory.build({
        startDate: 'Monday 7 April 2026', // Today
      })
      const presenter = new GroupDetailsPresenter(groupDetails)

      expect(presenter.isStartDateInThePast).toBe(false)
    })

    it('returns false when the start date is in the future', () => {
      const groupDetails = GroupDetailsFactory.build({
        startDate: 'Friday 10 April 2026', // Future date
      })
      const presenter = new GroupDetailsPresenter(groupDetails)

      expect(presenter.isStartDateInThePast).toBe(false)
    })

    it('returns true when the start date is yesterday', () => {
      const groupDetails = GroupDetailsFactory.build({
        startDate: 'Sunday 6 April 2026', // Yesterday
      })
      const presenter = new GroupDetailsPresenter(groupDetails)

      expect(presenter.isStartDateInThePast).toBe(true)
    })

    it('returns false when the start date is far in the future', () => {
      const groupDetails = GroupDetailsFactory.build({
        startDate: 'Thursday 15 October 2026',
      })
      const presenter = new GroupDetailsPresenter(groupDetails)

      expect(presenter.isStartDateInThePast).toBe(false)
    })

    it('handles dates across different years correctly', () => {
      const groupDetails2025 = GroupDetailsFactory.build({
        startDate: 'Thursday 10 April 2025',
      })
      const presenter2025 = new GroupDetailsPresenter(groupDetails2025)
      expect(presenter2025.isStartDateInThePast).toBe(true)

      const groupDetails2027 = GroupDetailsFactory.build({
        startDate: 'Wednesday 7 April 2027',
      })
      const presenter2027 = new GroupDetailsPresenter(groupDetails2027)
      expect(presenter2027.isStartDateInThePast).toBe(false)
    })

    it('correctly handles January dates', () => {
      const groupDetails = GroupDetailsFactory.build({
        startDate: 'Monday 5 January 2026', // January (month 0)
      })
      const presenter = new GroupDetailsPresenter(groupDetails)
      expect(presenter.isStartDateInThePast).toBe(true)
    })

    it('correctly handles December dates', () => {
      const groupDetails = GroupDetailsFactory.build({
        startDate: 'Tuesday 15 December 2026', // December (month 11)
      })
      const presenter = new GroupDetailsPresenter(groupDetails)
      expect(presenter.isStartDateInThePast).toBe(false)
    })

    it('correctly handles February dates', () => {
      const groupDetails = GroupDetailsFactory.build({
        startDate: 'Monday 2 February 2026', // February (month 1)
      })
      const presenter = new GroupDetailsPresenter(groupDetails)
      expect(presenter.isStartDateInThePast).toBe(true)
    })

    it('correctly handles September dates', () => {
      const groupDetails = GroupDetailsFactory.build({
        startDate: 'Monday 7 September 2026', // September (month 8)
      })
      const presenter = new GroupDetailsPresenter(groupDetails)
      expect(presenter.isStartDateInThePast).toBe(false)
    })

    it('correctly handles dates with mixed case month names', () => {
      const groupDetails = GroupDetailsFactory.build({
        startDate: 'Thursday 1 January 2026', // Mixed case
      })
      const presenter = new GroupDetailsPresenter(groupDetails)
      expect(presenter.isStartDateInThePast).toBe(true)
    })
  })

  describe('isScheduleUpdated', () => {
    it('returns true when message includes "schedule have been updated"', () => {
      const groupDetails = GroupDetailsFactory.build()
      const presenter = new GroupDetailsPresenter(groupDetails, 'The days and times and schedule have been updated.')

      expect(presenter.isScheduleUpdated).toBe(true)
    })

    it('returns false when message does not contain schedule update text', () => {
      const groupDetails = GroupDetailsFactory.build()
      const presenter = new GroupDetailsPresenter(groupDetails, 'The days and times have been updated.')

      expect(presenter.isScheduleUpdated).toBe(false)
    })

    it('returns false when message is an empty string', () => {
      const groupDetails = GroupDetailsFactory.build()
      const presenter = new GroupDetailsPresenter(groupDetails, '')

      expect(presenter.isScheduleUpdated).toBe(false)
    })
  })
})
