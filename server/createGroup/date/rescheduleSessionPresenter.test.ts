import { CreateGroupRequest } from '@manage-and-deliver-api'
import RescheduleSessionsPresenter from './rescheduleSessionPresenter'

describe('RescheduleSessionsPresenter', () => {
  const groupId = 'group-123'
  const mockGroupDetails: Partial<CreateGroupRequest> & { previousDate?: string } = {
    groupCode: 'TEST-GROUP-001',
    earliestStartDate: '15/06/2026',
    previousDate: 'Thursday 28 May 2026',
  }

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('sessionDateAndTimesSummary', () => {
    describe('when isEditDate is true', () => {
      it('returns summary list with both previous and new start dates', () => {
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

      it('formats dates correctly with day of week', () => {
        const groupDetails: Partial<CreateGroupRequest> & { previousDate?: string } = {
          groupCode: 'TEST-GROUP-002',
          earliestStartDate: '01/01/2027',
          previousDate: 'Thursday 28 May 2026',
        }

        const presenter = new RescheduleSessionsPresenter(groupId, groupDetails, true)

        const result = presenter.sessionDateAndTimesSummary

        expect(result[1]).toEqual({
          key: 'New start date',
          keyClass: 'session-reschedule-table-key-width',
          lines: ['Friday 1 January 2027'],
        })
      })
    })

    describe('when isEditDate is false', () => {
      it('returns an empty array', () => {
        const presenter = new RescheduleSessionsPresenter(groupId, mockGroupDetails, false)

        const result = presenter.sessionDateAndTimesSummary

        expect(result).toEqual([])
      })
    })
  })

  describe('formatDateWithDayOfWeek', () => {
    it('formats dates correctly', () => {
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
