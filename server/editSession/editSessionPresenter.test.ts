import { GroupSessionResponse } from '@manage-and-deliver-api'
import EditSessionPresenter from './editSessionPresenter'

describe('EditSessionPresenter', () => {
  const mockGroupId = 'group-123'
  const mockGroupName = 'Sample Group Name'
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

        const presenter = new EditSessionPresenter(
          mockGroupId,
          mockGroupName,
          sessionDetails,
          mockSessionId,
          mockDeleteUrl,
        )
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
                { html: 'Attended' },
                { html: 'Good participation' },
              ],
            },
            {
              id: 'attendance-multi-select-row-1',
              value: '456',
              cells: [
                { html: '<a href="/referral-details/456/personal-details">Jane Doe</a> CRN002' },
                { html: 'Not attended' },
                { html: 'Absent' },
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

        const presenter = new EditSessionPresenter(
          mockGroupId,
          mockGroupName,
          sessionDetails,
          mockSessionId,
          mockDeleteUrl,
        )
        const result = presenter.attendanceTableArgs

        expect(result).toEqual({
          head: [{ text: 'Name and CRN' }, { text: 'Attendance' }, { text: 'Session notes' }],
          rows: [
            [
              { html: '<a href="/referral-details/123/personal-details">Alex River</a> CRN001' },
              { html: 'Attended' },
              {
                html: '<a href="/group/group-123/session/session-456/referral/123/sample-group-name-session-notes">Alex River Sample Group Name</a>',
              },
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

        const presenter = new EditSessionPresenter(
          mockGroupId,
          mockGroupName,
          sessionDetails,
          mockSessionId,
          mockDeleteUrl,
        )
        const result = presenter.attendanceTableArgs

        expect(result).toEqual({
          head: [{ text: 'Name and CRN' }, { text: 'Attendance' }, { text: 'Session notes' }],
          rows: [],
        })
      })
    })
  })

  describe('backLinkArgs', () => {
    const sessionDetails: GroupSessionResponse = {
      pageTitle: 'Session 1',
      code: 'group-123',
      sessionType: 'Group',
      attendanceAndSessionNotes: [],
      date: '01 Feb 2026',
      time: '1:00pm',
      scheduledToAttend: [],
      facilitators: [],
    }

    describe('when isAttendanceHistory is true', () => {
      it('returns back link to attendance history page', () => {
        const presenter = new EditSessionPresenter(
          mockGroupId,
          mockGroupName,
          sessionDetails,
          mockSessionId,
          mockDeleteUrl,
          null,
          true,
        )

        expect(presenter.backLinkArgs).toEqual({
          text: 'Back to Attendance history',
          href: '/group/group-123/attendance-history',
        })
      })
    })

    describe('when isAttendanceHistory is false', () => {
      it('returns back link to sessions and attendance page', () => {
        const presenter = new EditSessionPresenter(
          mockGroupId,
          mockGroupName,
          sessionDetails,
          mockSessionId,
          mockDeleteUrl,
          null,
          false,
        )

        expect(presenter.backLinkArgs).toEqual({
          text: 'Back to Sessions and attendance',
          href: '/group/group-123/sessions-and-attendance',
        })
      })
    })

    describe('when isAttendanceHistory is not provided (defaults to false)', () => {
      it('returns back link to sessions and attendance page', () => {
        const presenter = new EditSessionPresenter(
          mockGroupId,
          mockGroupName,
          sessionDetails,
          mockSessionId,
          mockDeleteUrl,
        )

        expect(presenter.backLinkArgs).toEqual({
          text: 'Back to Sessions and attendance',
          href: '/group/group-123/sessions-and-attendance',
        })
      })
    })
  })
})
