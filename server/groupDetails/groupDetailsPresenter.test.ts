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
        startDate: 'Wednesday 1 April 2026',
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
        startDate: 'Thursday 15 October 2126',
      })
      const presenter = new GroupDetailsPresenter(groupDetails)

      expect(presenter.isStartDateInThePast).toBe(false)
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
