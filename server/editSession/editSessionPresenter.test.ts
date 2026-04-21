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
          isCatchup: false,
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
                { html: '<span class="govuk-tag govuk-tag--blue">Attended</span>' },
                {
                  html: '<a href="/group/group-123/session/session-456/session-1/session-notes?referralId=123&source=edit-session">Session 1 notes</a>',
                },
              ],
            },
            {
              id: 'attendance-multi-select-row-1',
              value: '456',
              cells: [
                { html: '<a href="/referral-details/456/personal-details">Jane Doe</a> CRN002' },
                { html: '<span class="govuk-tag govuk-tag--red">Not attended</span>' },
                {
                  html: '<a href="/group/group-123/session/session-456/session-1/session-notes?referralId=456&source=edit-session">Session 1 notes</a>',
                },
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
          isCatchup: false,
          attendanceAndSessionNotes: [
            {
              referralId: '123',
              name: 'Alex River',
              crn: 'CRN001',
              attendance: 'Attended - failed to comply',
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
              { html: '<span class="govuk-tag govuk-tag--yellow">Attended - failed to comply</span>' },
              {
                html: '<a href="/group/group-123/session/session-456/session-1/session-notes?referralId=123&source=edit-session">Session 1 notes</a>',
              },
            ],
          ],
        })
      })

      it('returns Not added when single-referral session notes are blank', () => {
        const sessionDetails: GroupSessionResponse = {
          pageTitle: 'Session 1',
          code: 'CODE-123',
          sessionType: 'Individual',
          isCatchup: false,
          attendanceAndSessionNotes: [
            {
              referralId: '123',
              name: 'Alex River',
              crn: 'CRN001',
              attendance: 'Attended',
              sessionNotes: '',
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
              { html: '<span class="govuk-tag govuk-tag--blue">Attended</span>' },
              {
                text: 'Not added',
              },
            ],
          ],
        })
      })

      it('returns Not added text when single-referral session notes equals Not added', () => {
        const sessionDetails: GroupSessionResponse = {
          pageTitle: 'Session 1',
          code: 'CODE-123',
          sessionType: 'Individual',
          isCatchup: false,
          attendanceAndSessionNotes: [
            {
              referralId: '123',
              name: 'Alex River',
              crn: 'CRN001',
              attendance: 'Attended',
              sessionNotes: 'Not added',
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
              { html: '<span class="govuk-tag govuk-tag--blue">Attended</span>' },
              {
                text: 'Not added',
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
          isCatchup: false,
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

      it('uses pageTitle slug for the session notes link', () => {
        const sessionDetails: GroupSessionResponse = {
          pageTitle: 'Pre-group one-to-one',
          code: 'CODE-123',
          sessionType: 'Individual',
          isCatchup: false,
          attendanceAndSessionNotes: [
            {
              referralId: '123',
              name: 'Alex River',
              crn: 'CRN001',
              attendance: 'Attended',
              sessionNotes: 'Notes recorded',
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
              { html: '<span class="govuk-tag govuk-tag--blue">Attended</span>' },
              {
                html: '<a href="/group/group-123/session/session-456/pre-group-one-to-one/session-notes?referralId=123&source=edit-session">Pre-group one-to-one notes</a>',
              },
            ],
          ],
        })
      })
    })

    describe('when attendance value is unmapped/mapped', () => {
      it('falls back to to be confirmed for unmapped outcome_type_code values', () => {
        const sessionDetails: GroupSessionResponse = {
          pageTitle: 'Session 1',
          code: 'CODE-123',
          sessionType: 'Group',
          isCatchup: false,
          attendanceAndSessionNotes: [
            {
              referralId: '123',
              name: 'Alex River',
              crn: 'CRN001',
              attendance: '',
              sessionNotes: 'Good participation',
              outcome_type_code: 'UAAB',
            } as GroupSessionResponse['attendanceAndSessionNotes'][number],
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
              { html: '<span class="govuk-tag govuk-tag--grey">To be confirmed</span>' },
              {
                html: '<a href="/group/group-123/session/session-456/session-1/session-notes?referralId=123&source=edit-session">Session 1 notes</a>',
              },
            ],
          ],
        })
      })

      it('falls back to to be confirmed for no did not attend text', () => {
        const sessionDetails: GroupSessionResponse = {
          pageTitle: 'Session 1',
          code: 'CODE-123',
          sessionType: 'Individual',
          isCatchup: false,
          attendanceAndSessionNotes: [
            {
              referralId: '123',
              name: 'Alex River',
              crn: 'CRN001',
              attendance: 'No - did not attend',
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
          head: [{ text: 'Name and CRN' }, { text: 'Attendance' }, { text: 'Session notes' }],
          rows: [
            [
              { html: '<a href="/referral-details/123/personal-details">Alex River</a> CRN001' },
              { html: '<span class="govuk-tag govuk-tag--grey">To be confirmed</span>' },
              {
                html: '<a href="/group/group-123/session/session-456/session-1/session-notes?referralId=123&source=edit-session">Session 1 notes</a>',
              },
            ],
          ],
        })
      })

      it('maps did not attend text to not attended tag', () => {
        const sessionDetails: GroupSessionResponse = {
          pageTitle: 'Session 1',
          code: 'CODE-123',
          sessionType: 'Individual',
          isCatchup: false,
          attendanceAndSessionNotes: [
            {
              referralId: '123',
              name: 'Alex River',
              crn: 'CRN001',
              attendance: 'Did not attend',
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
          head: [{ text: 'Name and CRN' }, { text: 'Attendance' }, { text: 'Session notes' }],
          rows: [
            [
              { html: '<a href="/referral-details/123/personal-details">Alex River</a> CRN001' },
              { html: '<span class="govuk-tag govuk-tag--red">Not attended</span>' },
              {
                html: '<a href="/group/group-123/session/session-456/session-1/session-notes?referralId=123&source=edit-session">Session 1 notes</a>',
              },
            ],
          ],
        })
      })
    })
  })

  describe('backLinkArgs', () => {
    const sessionDetails: GroupSessionResponse = {
      pageTitle: 'Session 1',
      code: 'group-123',
      sessionType: 'Group',
      isCatchup: false,
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
          sessionDetails,
          mockSessionId,
          mockDeleteUrl,
          null,
          true,
          null,
          'abc123',
        )

        expect(presenter.backLinkArgs).toEqual({
          text: 'Back to Attendance history',
          href: '/referral/abc123/attendance-history',
        })
      })
    })

    describe('when isAttendanceHistory is false', () => {
      it('returns back link to sessions and attendance page', () => {
        const presenter = new EditSessionPresenter(
          mockGroupId,
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
        const presenter = new EditSessionPresenter(mockGroupId, sessionDetails, mockSessionId, mockDeleteUrl)

        expect(presenter.backLinkArgs).toEqual({
          text: 'Back to Sessions and attendance',
          href: '/group/group-123/sessions-and-attendance',
        })
      })
    })
  })

  describe('canBeDeleted', () => {
    beforeEach(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2026-05-17T23:58:00'))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    const buildSessionDetails = (overrides: Partial<GroupSessionResponse> = {}): GroupSessionResponse => ({
      pageTitle: 'Session 1',
      code: 'CODE-123',
      sessionType: 'Individual',
      isCatchup: false,
      attendanceAndSessionNotes: [],
      date: 'Sunday 17 May 2026',
      time: '11:57am to 11:58am',
      scheduledToAttend: [],
      facilitators: [],
      ...overrides,
    })

    it('returns false when individual session start date/time has passed', () => {
      const presenter = new EditSessionPresenter(mockGroupId, buildSessionDetails(), mockSessionId, mockDeleteUrl)

      expect(presenter.canBeDeleted).toBe(false)
    })

    it('returns true when individual session start date/time is in the future', () => {
      const presenter = new EditSessionPresenter(
        mockGroupId,
        buildSessionDetails({ time: '11:59pm to 12:00am' }),
        mockSessionId,
        mockDeleteUrl,
      )

      expect(presenter.canBeDeleted).toBe(true)
    })

    it('returns false when session type is not individual', () => {
      const presenter = new EditSessionPresenter(
        mockGroupId,
        buildSessionDetails({ sessionType: 'Group' }),
        mockSessionId,
        mockDeleteUrl,
      )

      expect(presenter.canBeDeleted).toBe(false)
    })
  })
})
