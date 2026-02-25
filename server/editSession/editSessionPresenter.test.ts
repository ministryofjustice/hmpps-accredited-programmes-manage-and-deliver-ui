import { GroupSessionResponse } from '@manage-and-deliver-api'
import EditSessionPresenter from './editSessionPresenter'

describe('EditSessionPresenter', () => {
  const mockGroupId = 'group-123'
  const mockSessionId = 'session-456'
  const mockDeleteUrl = '/delete-url'

  describe('attendanceTableArgs', () => {
    describe('when there are multiple referrals', () => {
      it('returns MultiSelectTableArgs with correct structure', () => {
        const sessionDetails: GroupSessionResponse = {
          pageTitle: 'Session 1',
          code: 'CODE-123',
          sessionType: 'Group',
          attendanceAndSessionNotes: [
            {
              referralId: '123',
              name: 'Alex River',
              crn: 'CRN001',
              attendance: 'Attended',
              sessionNotes: 'Good participation',
            },
            {
              referralId: '456',
              name: 'Jane Doe',
              crn: 'CRN002',
              attendance: 'Not attended',
              sessionNotes: 'Absent',
            },
          ],
          date: '01 Feb 2026',
          time: '1:00pm',
          scheduledToAttend: [],
          facilitators: [],
        }

        const presenter = new EditSessionPresenter(mockGroupId, sessionDetails, mockSessionId, mockDeleteUrl)
        const result = presenter.attendanceTableArgs

        expect(result).toEqual({
          idPrefix: 'attendance-multi-select',
          headers: [{ text: 'Name and CRN' }, { text: 'Attendance' }, { text: 'Session notes' }],
          rows: [
            {
              id: 'attendance-multi-select-row-0',
              value: '123',
              cells: [
                { html: '<a href="/referral-details/123/personal-details">Alex River</a> CRN001' },
                'Attended',
                'Good participation',
              ],
            },
            {
              id: 'attendance-multi-select-row-1',
              value: '456',
              cells: [
                { html: '<a href="/referral-details/456/personal-details">Jane Doe</a> CRN002' },
                'Not attended',
                'Absent',
              ],
            },
          ],
        })
      })
    })

    describe('when there is a single referral', () => {
      it('returns TableArgs with correct structure', () => {
        const sessionDetails: GroupSessionResponse = {
          pageTitle: 'Session 1',
          code: 'CODE-123',
          sessionType: 'Individual',
          attendanceAndSessionNotes: [
            {
              referralId: '123',
              name: 'Alex River',
              crn: 'CRN001',
              attendance: 'Attended',
              sessionNotes: 'Good progress',
            },
          ],
          date: '01 Feb 2026',
          time: '1:00pm',
          scheduledToAttend: [],
          facilitators: [],
        }

        const presenter = new EditSessionPresenter(mockGroupId, sessionDetails, mockSessionId, mockDeleteUrl)
        const result = presenter.attendanceTableArgs

        expect(result).toEqual({
          head: [{ text: 'Name and CRN' }, { text: 'Attendance' }, { text: 'Session notes' }],
          rows: [
            [
              { html: '<a href="/referral-details/123/personal-details">Alex River</a> CRN001' },
              { text: 'Attended' },
              { text: 'Good progress' },
            ],
          ],
        })
      })
    })

    describe('when there is no attendance data', () => {
      it('returns empty TableArgs', () => {
        const sessionDetails: GroupSessionResponse = {
          pageTitle: 'Session 1',
          code: 'CODE-123',
          sessionType: 'Individual',
          attendanceAndSessionNotes: [],
          date: '01 Feb 2026',
          time: '1:00pm',
          scheduledToAttend: [],
          facilitators: [],
        }

        const presenter = new EditSessionPresenter(mockGroupId, sessionDetails, mockSessionId, mockDeleteUrl)
        const result = presenter.attendanceTableArgs

        expect(result).toEqual({
          head: [{ text: 'Name and CRN' }, { text: 'Attendance' }, { text: 'Session notes' }],
          rows: [],
        })
      })
    })
  })
})
