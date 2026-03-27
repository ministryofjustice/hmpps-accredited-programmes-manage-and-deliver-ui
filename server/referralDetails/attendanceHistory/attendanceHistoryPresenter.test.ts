import { randomUUID } from 'crypto'
import attendanceHistoryResponseFactory from '../../testutils/factories/attendanceHistoryResponseFactory'
import referralDetailsFactory from '../../testutils/factories/referralDetailsFactory'
import AttendanceHistoryPresenter from './attendanceHistoryPresenter'

describe('AttendanceHistoryPresenter', () => {
  const referralId = randomUUID()
  const referralDetails = referralDetailsFactory.build({
    personName: 'Alex River',
    currentStatusDescription: 'Awaiting assessment',
  })

  describe('text', () => {
    it('should return the correct page heading', () => {
      const attendanceHistory = attendanceHistoryResponseFactory.build()
      const presenter = new AttendanceHistoryPresenter(referralId, attendanceHistory, referralDetails)

      expect(presenter.text.pageHeading).toBe('Attendance history: Alex River')
    })
  })

  describe('tableDescription', () => {
    it('should return correct description when has group code and sessions', () => {
      const attendanceHistory = attendanceHistoryResponseFactory.build()
      const presenter = new AttendanceHistoryPresenter(referralId, attendanceHistory, referralDetails)

      expect(presenter.tableDescription).toContain("This is Alex River's attendance record and session notes.")
      expect(presenter.tableDescription).toContain('group GRP-001 Sessions and attendance')
      expect(presenter.tableDescription).toContain(
        `href="/group/${referralDetails.currentlyAllocatedGroupId}/sessions-and-attendance"`,
      )
    })

    it('should return correct description when has group code but no sessions', () => {
      const attendanceHistory = attendanceHistoryResponseFactory.withNoSessions().build()
      const presenter = new AttendanceHistoryPresenter(referralId, attendanceHistory, referralDetails)

      expect(presenter.tableDescription).toContain('Alex River currently has no attendance history.')
      expect(presenter.tableDescription).toContain('group GRP-001 Sessions and attendance')
    })

    it('should return correct description when has sessions but no group code', () => {
      const attendanceHistory = attendanceHistoryResponseFactory.withNoGroup().build()
      const presenter = new AttendanceHistoryPresenter(referralId, attendanceHistory, referralDetails)

      expect(presenter.tableDescription).toBe(
        'Alex River is not currently allocated to a group. This is the attendance history for groups they were previously allocated to as part of this referral.',
      )
    })

    it('should return correct description when has no group code and no sessions', () => {
      const attendanceHistory = attendanceHistoryResponseFactory.withNoGroupAndNoSessions().build()
      const presenter = new AttendanceHistoryPresenter(referralId, attendanceHistory, referralDetails)

      expect(presenter.tableDescription).toBe(
        'Alex River is not allocated to a group and has no attendance history connected to this referral.',
      )
    })
  })

  describe('attendanceHistoryTableArgs', () => {
    it('should return correct table rows for sessions', () => {
      const attendanceHistory = attendanceHistoryResponseFactory.build()
      const presenter = new AttendanceHistoryPresenter(referralId, attendanceHistory, referralDetails)
      const rows = presenter.attendanceHistoryTableArgs

      expect(rows).toHaveLength(2)
      expect(rows[0]).toEqual([
        {
          html: `<a href="/group/${referralDetails.currentlyAllocatedGroupId}/session/session-1/edit-session?isAttendanceHistory=true&referralId=${referralId}" class="govuk-link">Pre-group one-to-one</a>`,
        },
        { text: 'GRP-001' },
        { text: '11 July 2025' },
        { text: '10:30am to 11am' },
        { html: `<span class="govuk-tag govuk-tag--blue">Attended</span>` },
        {
          html: `<a href="/group/${referralDetails.currentlyAllocatedGroupId}/session/session-1/pre-group-one-to-one/session-notes?referralId=${referralId}&isAttendanceHistory=true" class="govuk-link">Pre-group one-to-one attendance and notes</a>`,
        },
      ])
      expect(rows[1]).toEqual([
        {
          html: `<a href="/group/${referralDetails.currentlyAllocatedGroupId}/session/session-2/edit-session?isAttendanceHistory=true&referralId=${referralId}" class="govuk-link">Session 1: Introduction</a>`,
        },
        { text: 'GRP-001' },
        { text: '18 July 2025' },
        { text: '2pm to 3pm' },
        { html: `<span class="govuk-tag govuk-tag--red">Not attended</span>` },
        { text: 'Not added' },
      ])
    })

    it('should return "N/A" for group code when not provided', () => {
      const attendanceHistory = attendanceHistoryResponseFactory.build({
        attendanceHistory: [
          {
            sessionId: 'session-1',
            sessionName: 'Session 1',
            groupCode: null as unknown as string,
            date: '11 July 2025',
            time: '10:30am',
            attendanceStatus: 'Attended',
            hasNotes: false,
          },
        ],
      })
      const presenter = new AttendanceHistoryPresenter(referralId, attendanceHistory, referralDetails)
      const rows = presenter.attendanceHistoryTableArgs

      expect(rows[0][1]).toEqual({ text: 'N/A' })
    })

    it('should return empty array when no sessions', () => {
      const attendanceHistory = attendanceHistoryResponseFactory.withNoSessions().build()
      const presenter = new AttendanceHistoryPresenter(referralId, attendanceHistory, referralDetails)

      expect(presenter.attendanceHistoryTableArgs).toEqual([])
    })
  })
})
