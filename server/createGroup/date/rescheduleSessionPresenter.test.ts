import { CreateGroupRequest, CreateGroupSessionSlot } from '@manage-and-deliver-api'
import RescheduleSessionsPresenter from './rescheduleSessionPresenter'

describe('RescheduleSessionsPresenter', () => {
  const groupId = 'group-123'

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('backLinkUri', () => {
    it('returns edit-group-start-date link when isEditDate is true', () => {
      const mockGroupDetails: Partial<CreateGroupRequest> = {
        groupCode: 'TEST-GROUP-001',
      }
      const presenter = new RescheduleSessionsPresenter(groupId, mockGroupDetails, true)

      expect(presenter.backLinkUri).toEqual('/group/group-123/edit-group-start-date')
    })

    it('returns edit-group-days-and-times link when isEditDate is false', () => {
      const mockGroupDetails: Partial<CreateGroupRequest> = {
        groupCode: 'TEST-GROUP-001',
      }
      const presenter = new RescheduleSessionsPresenter(groupId, mockGroupDetails, false)

      expect(presenter.backLinkUri).toEqual('/group/group-123/edit-group-days-and-times')
    })
  })

  describe('sessionDateAndTimesSummary', () => {
    describe('when isEditDate is true', () => {
      it('returns summary list with both previous and new start dates', () => {
        const mockGroupDetails: Partial<CreateGroupRequest> & { previousDate?: string } = {
          groupCode: 'TEST-GROUP-001',
          earliestStartDate: '15/06/2026',
          previousDate: 'Thursday 28 May 2026',
        }
        const presenter = new RescheduleSessionsPresenter(groupId, mockGroupDetails, true)

        const result = presenter.sessionDateAndTimesSummary

        expect(result).toHaveLength(2)
        expect(result[0]).toEqual({
          key: 'Previous start date',
          keyClass: 'session-reschedule-table-key-width',
          lines: ['Thursday 28 May 2026'],
        })
        expect(result[1]).toEqual({
          key: 'New start date',
          keyClass: 'session-reschedule-table-key-width',
          lines: ['Monday 15 June 2026'],
        })
      })
    })

    describe('when isEditDate is false', () => {
      it('returns summary list with previous and new days and times', () => {
        const previousSessions: CreateGroupSessionSlot[] = [
          { dayOfWeek: 'MONDAY', hour: 9, minutes: 30, amOrPm: 'AM' },
          { dayOfWeek: 'THURSDAY', hour: 2, minutes: 0, amOrPm: 'PM' },
        ]
        const newSessions: CreateGroupSessionSlot[] = [
          { dayOfWeek: 'TUESDAY', hour: 10, minutes: 0, amOrPm: 'AM' },
          { dayOfWeek: 'FRIDAY', hour: 1, minutes: 30, amOrPm: 'PM' },
        ]
        const mockGroupDetails: Partial<CreateGroupRequest> & { previousSessions?: CreateGroupSessionSlot[] } = {
          groupCode: 'TEST-GROUP-005',
          previousSessions,
          createGroupSessionSlot: newSessions,
        }

        const presenter = new RescheduleSessionsPresenter(groupId, mockGroupDetails, false)

        const result = presenter.sessionDateAndTimesSummary

        expect(result).toHaveLength(2)
        expect(result[0]).toEqual({
          key: 'Previous days and times',
          keyClass: 'session-reschedule-table-key-width',
          lines: ['Mondays, 9:30am to midday', 'Thursdays, 2pm to 4:30pm'],
        })
        expect(result[1]).toEqual({
          key: 'New days and times',
          keyClass: 'session-reschedule-table-key-width',
          lines: ['Tuesdays, 10am to 12:30pm', 'Fridays, 1:30pm to 4pm'],
        })
      })
    })
  })

  describe('formatDateWithDayOfWeek', () => {
    it('formats dates correctly with day of week', () => {
      const groupDetails: Partial<CreateGroupRequest> & { previousDate?: string } = {
        groupCode: 'TEST-GROUP-005',
        earliestStartDate: '06/04/2026',
        previousDate: 'Thursday 28 May 2026',
      }

      const presenter = new RescheduleSessionsPresenter(groupId, groupDetails, true)
      const result = presenter.sessionDateAndTimesSummary

      expect(result[1].lines[0]).toContain('Monday 6 April 2026')
    })
  })
})
