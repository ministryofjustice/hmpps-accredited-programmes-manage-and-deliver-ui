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

      expect(summary).toContainEqual({
        key: 'Group code',
        lines: [groupDetails.code],
        changeLink: '/group-abc/edit-group-code',
        visuallyHiddenText: 'group code',
      })
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

    it('returns the start date with change link when date is in the future', () => {
      const groupDetails = GroupDetailsFactory.build({
        id: 'group-abc',
        startDate: 'Friday 10 April 2026',
      })
      const presenter = new GroupDetailsPresenter(groupDetails)

      const summary = presenter.getGroupTimingsSummary()

      expect(summary).toContainEqual({
        key: 'Start date',
        lines: ['Friday 10 April 2026'],
        changeLink: '/group-abc/edit-group-start-date',
        visuallyHiddenText: 'start date',
      })
    })

    it('returns null change link when start date is in the past', () => {
      const groupDetails = GroupDetailsFactory.build({
        id: 'group-abc',
        startDate: 'Wednesday 1 April 2026',
      })
      const presenter = new GroupDetailsPresenter(groupDetails)

      const summary = presenter.getGroupTimingsSummary()

      expect(summary[0].changeLink).toBeNull()
    })

    it('returns the days and times change link', () => {
      const groupDetails = GroupDetailsFactory.build({
        id: 'group-abc',
        daysAndTimes: ['Monday 2:00 PM - 4:00 PM'],
      })
      const presenter = new GroupDetailsPresenter(groupDetails)

      const summary = presenter.getGroupTimingsSummary()

      expect(summary).toContainEqual({
        key: 'Days and times',
        lines: ['Monday 2:00 PM - 4:00 PM'],
        changeLink: '/group-abc/edit-group-days-and-times',
        visuallyHiddenText: 'days and times',
      })
    })
  })

  describe('getGroupParticipantsSummary', () => {
    it('returns the cohort change link', () => {
      const groupDetails = GroupDetailsFactory.build({ id: 'group-abc' })
      const presenter = new GroupDetailsPresenter(groupDetails)

      const summary = presenter.getGroupParticipantsSummary()

      expect(summary).toContainEqual({
        key: 'Cohort',
        lines: [groupDetails.cohort],
        changeLink: '/group-abc/edit-group-cohort',
        visuallyHiddenText: 'cohort',
      })
    })

    it('returns the gender change link', () => {
      const groupDetails = GroupDetailsFactory.build({ id: 'group-abc' })
      const presenter = new GroupDetailsPresenter(groupDetails)

      const summary = presenter.getGroupParticipantsSummary()

      expect(summary).toContainEqual({
        key: 'Gender',
        lines: [groupDetails.sex],
        changeLink: '/group-abc/edit-group-gender',
        visuallyHiddenText: 'gender',
      })
    })
  })

  describe('getGroupLocationSummary', () => {
    it('returns the PDU change link', () => {
      const groupDetails = GroupDetailsFactory.build({ id: 'group-abc' })
      const presenter = new GroupDetailsPresenter(groupDetails)

      const summary = presenter.getGroupLocationSummary()

      expect(summary).toContainEqual({
        key: 'Probation delivery unit (PDU)',
        lines: [groupDetails.pduName],
        changeLink: '/group-abc/edit-group-probation-delivery-unit',
        visuallyHiddenText: 'PDU',
      })
    })

    it('returns the delivery location change link', () => {
      const groupDetails = GroupDetailsFactory.build({ id: 'group-abc' })
      const presenter = new GroupDetailsPresenter(groupDetails)

      const summary = presenter.getGroupLocationSummary()

      expect(summary).toContainEqual({
        key: 'Delivery location',
        lines: [groupDetails.deliveryLocation],
        changeLink: '/group-abc/edit-group-delivery-location',
        visuallyHiddenText: 'delivery location',
      })
    })
  })

  describe('getGroupStaffSummary', () => {
    it('returns the treatment manager change link', () => {
      const groupDetails = GroupDetailsFactory.build({ id: 'group-abc' })
      const presenter = new GroupDetailsPresenter(groupDetails)

      const summary = presenter.getGroupStaffSummary()

      expect(summary).toContainEqual({
        key: 'Treatment Manager',
        lines: [groupDetails.treatmentManager?.facilitator || 'None added'],
        changeLink: '/group-abc/edit-group-facilitators',
        visuallyHiddenText: ' treatment manager',
      })
    })

    it('returns the facilitators change link', () => {
      const groupDetails = GroupDetailsFactory.build({ id: 'group-abc' })
      const presenter = new GroupDetailsPresenter(groupDetails)

      const summary = presenter.getGroupStaffSummary()

      expect(summary).toContainEqual({
        key: 'Facilitators',
        lines:
          groupDetails.facilitators.length > 0 ? groupDetails.facilitators.map(f => f.facilitator) : ['None added'],
        changeLink: '/group-abc/edit-group-facilitators',
        visuallyHiddenText: 'facilitators',
      })
    })

    it('returns the cover facilitators change link', () => {
      const groupDetails = GroupDetailsFactory.build({ id: 'group-abc' })
      const presenter = new GroupDetailsPresenter(groupDetails)

      const summary = presenter.getGroupStaffSummary()

      expect(summary).toContainEqual({
        key: 'Cover facilitators',
        lines: expect.any(Array),
        changeLink: '/group-abc/edit-group-facilitators',
        visuallyHiddenText: 'cover facilitators',
      })
    })
  })
})
