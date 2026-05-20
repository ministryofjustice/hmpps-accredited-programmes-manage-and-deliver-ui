import GroupDetailsPresenter from './groupDetailsPresenter'
import GroupDetailsFactory from '../testutils/factories/groupDetailsFactory'

describe('GroupDetailsPresenter', () => {
  describe('pageTitle', () => {
    it('returns the correct page title', () => {
      const groupDetails = GroupDetailsFactory.build()
      const presenter = new GroupDetailsPresenter(groupDetails)

      expect(presenter.pageTitle).toEqual('Group details')
    })
  })

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

  describe('getGroupCodeSummary', () => {
    it('returns the group code change link', () => {
      const groupDetails = GroupDetailsFactory.build({ id: 'group-abc' })
      const presenter = new GroupDetailsPresenter(groupDetails)

      const summary = presenter.getGroupCodeSummary()

      expect(summary[0].changeLink).toEqual('/group-abc/edit-group-code')
    })
  })

  describe('getGroupTimingsSummary', () => {
    beforeEach(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2026-04-07T12:00:00Z'))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('returns the start date change link when start date is in the future', () => {
      const groupDetails = GroupDetailsFactory.build({
        id: 'group-abc',
        startDate: 'Friday 10 April 2026',
      })
      const presenter = new GroupDetailsPresenter(groupDetails)

      const summary = presenter.getGroupTimingsSummary()

      expect(summary[0].changeLink).toEqual('/group-abc/edit-group-start-date')
    })

    it('returns null start date change link when start date is in the past', () => {
      const groupDetails = GroupDetailsFactory.build({
        id: 'group-abc',
        startDate: 'Wednesday 1 April 2026',
      })
      const presenter = new GroupDetailsPresenter(groupDetails)

      const summary = presenter.getGroupTimingsSummary()

      expect(summary[0].changeLink).toBeNull()
    })

    it('returns the days and times change link', () => {
      const groupDetails = GroupDetailsFactory.build({ id: 'group-abc' })
      const presenter = new GroupDetailsPresenter(groupDetails)

      const summary = presenter.getGroupTimingsSummary()

      expect(summary[1].changeLink).toEqual('/group-abc/edit-group-days-and-times')
    })
  })

  describe('getGroupParticipantsSummary', () => {
    it('returns the cohort change link', () => {
      const groupDetails = GroupDetailsFactory.build({ id: 'group-abc' })
      const presenter = new GroupDetailsPresenter(groupDetails)

      const summary = presenter.getGroupParticipantsSummary()

      expect(summary[0].changeLink).toEqual('/group-abc/edit-group-cohort')
    })

    it('returns the gender change link', () => {
      const groupDetails = GroupDetailsFactory.build({ id: 'group-abc' })
      const presenter = new GroupDetailsPresenter(groupDetails)

      const summary = presenter.getGroupParticipantsSummary()

      expect(summary[1].changeLink).toEqual('/group-abc/edit-group-gender')
    })
  })

  describe('getGroupLocationSummary', () => {
    it('returns the PDU change link', () => {
      const groupDetails = GroupDetailsFactory.build({ id: 'group-abc' })
      const presenter = new GroupDetailsPresenter(groupDetails)

      const summary = presenter.getGroupLocationSummary()

      expect(summary[0].changeLink).toEqual('/group-abc/edit-group-probation-delivery-unit')
    })

    it('returns the delivery location change link', () => {
      const groupDetails = GroupDetailsFactory.build({ id: 'group-abc' })
      const presenter = new GroupDetailsPresenter(groupDetails)

      const summary = presenter.getGroupLocationSummary()

      expect(summary[1].changeLink).toEqual('/group-abc/edit-group-delivery-location')
    })
  })

  describe('getGroupStaffSummary', () => {
    it('returns the treatment manager change link', () => {
      const groupDetails = GroupDetailsFactory.build({ id: 'group-abc' })
      const presenter = new GroupDetailsPresenter(groupDetails)

      const summary = presenter.getGroupStaffSummary()

      expect(summary[0].changeLink).toEqual('/group-abc/edit-group-facilitators')
    })

    it('returns the facilitators change link', () => {
      const groupDetails = GroupDetailsFactory.build({ id: 'group-abc' })
      const presenter = new GroupDetailsPresenter(groupDetails)

      const summary = presenter.getGroupStaffSummary()

      expect(summary[1].changeLink).toEqual('/group-abc/edit-group-facilitators')
    })

    it('returns the cover facilitators change link', () => {
      const groupDetails = GroupDetailsFactory.build({ id: 'group-abc' })
      const presenter = new GroupDetailsPresenter(groupDetails)

      const summary = presenter.getGroupStaffSummary()

      expect(summary[2].changeLink).toEqual('/group-abc/edit-group-facilitators')
    })
  })
})
