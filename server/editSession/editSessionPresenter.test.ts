import { GroupSessionResponse } from '@manage-and-deliver-api'
import EditSessionPresenter from './editSessionPresenter'
import { FormValidationError } from '../utils/formValidationError'

const laoBadgeHtml = ' <br><span class="moj-badge moj-badge--red">RESTRICTED ACCESS</span>'

const nameCrnCellHtml = (referralId: string, name: string, crn: string, indent: number, lao = false): string =>
  `<a href="/referral-details/${referralId}/personal-details">${name}</a> ${crn}\n${' '.repeat(indent)}${lao ? laoBadgeHtml : ''}`

describe('EditSessionPresenter', () => {
  const mockGroupId = 'group-123'
  const mockSessionId = 'session-456'
  const mockDeleteUrl = '/delete-url'

  describe('pageTitle', () => {
    it('returns the session page title', () => {
      const sessionDetails: GroupSessionResponse = {
        pageTitle: 'Session 1',
        code: 'CODE-123',
        sessionType: 'Group',
        isCatchup: false,
        attendanceAndSessionNotes: [],
        date: '01 Feb 2026',
        time: '1:00pm',
        unformattedEndDate: '2026-02-01T14:00:00',
        scheduledToAttend: [],
        facilitators: [],
      }

      const presenter = new EditSessionPresenter(mockGroupId, sessionDetails, mockSessionId, mockDeleteUrl)

      expect(presenter.pageTitle).toBe('Session 1')
    })

    it('normalises one-to-one page title when prefixed with person details', () => {
      const sessionDetails: GroupSessionResponse = {
        pageTitle: 'Alex River S688890821: Getting started one-to-one',
        code: 'CODE-123',
        sessionType: 'Individual',
        isCatchup: false,
        attendanceAndSessionNotes: [],
        date: '01 Feb 2026',
        time: '1:00pm',
        unformattedEndDate: '2026-02-01T14:00:00',
        scheduledToAttend: [],
        facilitators: [],
      }

      const presenter = new EditSessionPresenter(mockGroupId, sessionDetails, mockSessionId, mockDeleteUrl)

      expect(presenter.pageTitle).toBe('Getting started one-to-one')
    })
  })

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
              lao: false,
            },
            {
              referralId: '456',
              name: 'Jane Doe',
              crn: 'CRN002',
              attendance: 'Not attended',
              sessionNotes: 'Absent',
              lao: false,
            },
          ],
          date: '01 Feb 2026',
          time: '1:00pm',
          unformattedEndDate: '2026-02-01T14:00:00',
          scheduledToAttend: [],
          facilitators: [],
        }

        const presenter = new EditSessionPresenter(mockGroupId, sessionDetails, mockSessionId, mockDeleteUrl)
        const result = presenter.attendanceTableArgs

        expect(result).toEqual({
          idPrefix: 'attendance-multi-select',
          headers: [{ text: 'Name and CRN' }, { text: 'Attendance' }, { text: 'Session notes' }],
          caption: 'Attendance record and session notes',
          captionClasses: 'govuk-visually-hidden',
          rows: [
            {
              id: 'attendance-multi-select-row-0',
              value: '123',
              checkBoxLabel: 'Alex River',
              cells: [
                { html: nameCrnCellHtml('123', 'Alex River', 'CRN001', 20) },
                { html: '<span class="govuk-tag govuk-tag--blue">Attended</span>' },
                {
                  html: '<a href="/group-123/session-456/session-1-attendance-and-session-notes?referralId=123&source=edit-session">Alex River: Session 1 notes</a>',
                },
              ],
            },
            {
              id: 'attendance-multi-select-row-1',
              value: '456',
              checkBoxLabel: 'Jane Doe',
              cells: [
                { html: nameCrnCellHtml('456', 'Jane Doe', 'CRN002', 20) },
                { html: '<span class="govuk-tag govuk-tag--red">Not attended</span>' },
                {
                  html: '<a href="/group-123/session-456/session-1-attendance-and-session-notes?referralId=456&source=edit-session">Jane Doe: Session 1 notes</a>',
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
              lao: false,
            },
          ],
          date: '01 Feb 2026',
          time: '1:00pm',
          unformattedEndDate: '2026-02-01T14:00:00',
          scheduledToAttend: [],
          facilitators: [],
        }

        const presenter = new EditSessionPresenter(mockGroupId, sessionDetails, mockSessionId, mockDeleteUrl)
        const result = presenter.attendanceTableArgs

        expect(result).toEqual({
          head: [{ text: 'Name and CRN' }, { text: 'Attendance' }, { text: 'Session notes' }],
          caption: 'Attendance record and session notes',
          captionClasses: 'govuk-visually-hidden',
          rows: [
            [
              { html: nameCrnCellHtml('123', 'Alex River', 'CRN001', 26) },
              { html: '<span class="govuk-tag govuk-tag--yellow">Attended - failed to comply</span>' },
              {
                html: '<a href="/group-123/session-456/session-1-attendance-and-session-notes?referralId=123&source=edit-session">Alex River: Session 1 notes</a>',
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
              lao: false,
            },
          ],
          date: '01 Feb 2026',
          time: '1:00pm',
          unformattedEndDate: '2026-02-01T14:00:00',
          scheduledToAttend: [],
          facilitators: [],
        }

        const presenter = new EditSessionPresenter(mockGroupId, sessionDetails, mockSessionId, mockDeleteUrl)
        const result = presenter.attendanceTableArgs

        expect(result).toEqual({
          head: [{ text: 'Name and CRN' }, { text: 'Attendance' }, { text: 'Session notes' }],
          caption: 'Attendance record and session notes',
          captionClasses: 'govuk-visually-hidden',
          rows: [
            [
              { html: nameCrnCellHtml('123', 'Alex River', 'CRN001', 26) },
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
              lao: false,
            },
          ],
          date: '01 Feb 2026',
          time: '1:00pm',
          unformattedEndDate: '2026-02-01T14:00:00',
          scheduledToAttend: [],
          facilitators: [],
        }

        const presenter = new EditSessionPresenter(mockGroupId, sessionDetails, mockSessionId, mockDeleteUrl)
        const result = presenter.attendanceTableArgs

        expect(result).toEqual({
          head: [{ text: 'Name and CRN' }, { text: 'Attendance' }, { text: 'Session notes' }],
          caption: 'Attendance record and session notes',
          captionClasses: 'govuk-visually-hidden',
          rows: [
            [
              { html: nameCrnCellHtml('123', 'Alex River', 'CRN001', 26) },
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
          unformattedEndDate: '2026-02-01T14:00:00',
          scheduledToAttend: [],
          facilitators: [],
        }

        const presenter = new EditSessionPresenter(mockGroupId, sessionDetails, mockSessionId, mockDeleteUrl)
        const result = presenter.attendanceTableArgs

        expect(result).toEqual({
          head: [{ text: 'Name and CRN' }, { text: 'Attendance' }, { text: 'Session notes' }],
          caption: 'Attendance record and session notes',
          captionClasses: 'govuk-visually-hidden',
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
              lao: false,
            },
          ],
          date: '01 Feb 2026',
          time: '1:00pm',
          unformattedEndDate: '2026-02-01T14:00:00',
          scheduledToAttend: [],
          facilitators: [],
        }

        const presenter = new EditSessionPresenter(mockGroupId, sessionDetails, mockSessionId, mockDeleteUrl)
        const result = presenter.attendanceTableArgs

        expect(result).toEqual({
          head: [{ text: 'Name and CRN' }, { text: 'Attendance' }, { text: 'Session notes' }],
          caption: 'Attendance record and session notes',
          captionClasses: 'govuk-visually-hidden',
          rows: [
            [
              { html: nameCrnCellHtml('123', 'Alex River', 'CRN001', 26) },
              { html: '<span class="govuk-tag govuk-tag--blue">Attended</span>' },
              {
                html: '<a href="/group-123/session-456/pre-group-one-to-one-attendance-and-session-notes?referralId=123&source=edit-session">Alex River: Pre-group one-to-one notes</a>',
              },
            ],
          ],
        })
      })

      it('appends catch-up to the session notes link slug for catch-up sessions', () => {
        const sessionDetails: GroupSessionResponse = {
          pageTitle: 'Getting started 1',
          code: 'CODE-123',
          sessionType: 'Group',
          isCatchup: true,
          attendanceAndSessionNotes: [
            {
              referralId: '123',
              name: 'Alex River',
              crn: 'CRN001',
              attendance: 'Attended',
              sessionNotes: 'Notes recorded',
              lao: false,
            },
          ],
          date: '01 Feb 2026',
          time: '1:00pm',
          unformattedEndDate: '2026-02-01T14:00:00',
          scheduledToAttend: [],
          facilitators: [],
        }

        const presenter = new EditSessionPresenter(mockGroupId, sessionDetails, mockSessionId, mockDeleteUrl)
        const result = presenter.attendanceTableArgs

        expect(result).toEqual({
          head: [{ text: 'Name and CRN' }, { text: 'Attendance' }, { text: 'Session notes' }],
          caption: 'Attendance record and session notes',
          captionClasses: 'govuk-visually-hidden',
          rows: [
            [
              { html: nameCrnCellHtml('123', 'Alex River', 'CRN001', 26) },
              { html: '<span class="govuk-tag govuk-tag--blue">Attended</span>' },
              {
                html: '<a href="/group-123/session-456/getting-started-1-catch-up-attendance-and-session-notes?referralId=123&source=edit-session">Alex River: Getting started 1 notes</a>',
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
              lao: false,
            } as GroupSessionResponse['attendanceAndSessionNotes'][number],
          ],
          date: '01 Feb 2026',
          time: '1:00pm',
          unformattedEndDate: '2026-02-01T14:00:00',
          scheduledToAttend: [],
          facilitators: [],
        }

        const presenter = new EditSessionPresenter(mockGroupId, sessionDetails, mockSessionId, mockDeleteUrl)
        const result = presenter.attendanceTableArgs

        expect(result).toEqual({
          head: [{ text: 'Name and CRN' }, { text: 'Attendance' }, { text: 'Session notes' }],
          caption: 'Attendance record and session notes',
          captionClasses: 'govuk-visually-hidden',
          rows: [
            [
              { html: nameCrnCellHtml('123', 'Alex River', 'CRN001', 26) },
              { html: '<span class="govuk-tag govuk-tag--grey">To be confirmed</span>' },
              {
                html: '<a href="/group-123/session-456/session-1-attendance-and-session-notes?referralId=123&source=edit-session">Alex River: Session 1 notes</a>',
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
              lao: false,
            },
          ],
          date: '01 Feb 2026',
          time: '1:00pm',
          unformattedEndDate: '2026-02-01T14:00:00',
          scheduledToAttend: [],
          facilitators: [],
        }

        const presenter = new EditSessionPresenter(mockGroupId, sessionDetails, mockSessionId, mockDeleteUrl)
        const result = presenter.attendanceTableArgs

        expect(result).toEqual({
          head: [{ text: 'Name and CRN' }, { text: 'Attendance' }, { text: 'Session notes' }],
          caption: 'Attendance record and session notes',
          captionClasses: 'govuk-visually-hidden',
          rows: [
            [
              { html: nameCrnCellHtml('123', 'Alex River', 'CRN001', 26) },
              { html: '<span class="govuk-tag govuk-tag--grey">To be confirmed</span>' },
              {
                html: '<a href="/group-123/session-456/session-1-attendance-and-session-notes?referralId=123&source=edit-session">Alex River: Session 1 notes</a>',
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
              lao: false,
            },
          ],
          date: '01 Feb 2026',
          time: '1:00pm',
          unformattedEndDate: '2026-02-01T14:00:00',
          scheduledToAttend: [],
          facilitators: [],
        }

        const presenter = new EditSessionPresenter(mockGroupId, sessionDetails, mockSessionId, mockDeleteUrl)
        const result = presenter.attendanceTableArgs

        expect(result).toEqual({
          head: [{ text: 'Name and CRN' }, { text: 'Attendance' }, { text: 'Session notes' }],
          caption: 'Attendance record and session notes',
          captionClasses: 'govuk-visually-hidden',
          rows: [
            [
              { html: nameCrnCellHtml('123', 'Alex River', 'CRN001', 26) },
              { html: '<span class="govuk-tag govuk-tag--red">Not attended</span>' },
              {
                html: '<a href="/group-123/session-456/session-1-attendance-and-session-notes?referralId=123&source=edit-session">Alex River: Session 1 notes</a>',
              },
            ],
          ],
        })
      })
    })

    describe('when a referral is an LAO case', () => {
      it('renders the RESTRICTED ACCESS badge in the single-referral name cell', () => {
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
              sessionNotes: 'Good progress',
              lao: true,
            },
          ],
          date: '01 Feb 2026',
          time: '1:00pm',
          unformattedEndDate: '2026-02-01T14:00:00',
          scheduledToAttend: [],
          facilitators: [],
        }

        const presenter = new EditSessionPresenter(mockGroupId, sessionDetails, mockSessionId, mockDeleteUrl)
        const result = presenter.attendanceTableArgs

        expect(result).toEqual({
          head: [{ text: 'Name and CRN' }, { text: 'Attendance' }, { text: 'Session notes' }],
          caption: 'Attendance record and session notes',
          captionClasses: 'govuk-visually-hidden',
          rows: [
            [
              { html: nameCrnCellHtml('123', 'Alex River', 'CRN001', 26, true) },
              { html: '<span class="govuk-tag govuk-tag--blue">Attended</span>' },
              {
                html: '<a href="/group-123/session-456/session-1-attendance-and-session-notes?referralId=123&source=edit-session">Alex River: Session 1 notes</a>',
              },
            ],
          ],
        })
      })

      it('renders the RESTRICTED ACCESS badge only for LAO referrals in the multi-referral name cells', () => {
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
              lao: false,
            },
            {
              referralId: '456',
              name: 'Jane Doe',
              crn: 'CRN002',
              attendance: 'Not attended',
              sessionNotes: 'Absent',
              lao: true,
            },
          ],
          date: '01 Feb 2026',
          time: '1:00pm',
          unformattedEndDate: '2026-02-01T14:00:00',
          scheduledToAttend: [],
          facilitators: [],
        }

        const presenter = new EditSessionPresenter(mockGroupId, sessionDetails, mockSessionId, mockDeleteUrl)
        const result = presenter.attendanceTableArgs

        expect(result).toEqual({
          idPrefix: 'attendance-multi-select',
          headers: [{ text: 'Name and CRN' }, { text: 'Attendance' }, { text: 'Session notes' }],
          caption: 'Attendance record and session notes',
          captionClasses: 'govuk-visually-hidden',
          rows: [
            {
              id: 'attendance-multi-select-row-0',
              value: '123',
              checkBoxLabel: 'Alex River',
              cells: [
                { html: nameCrnCellHtml('123', 'Alex River', 'CRN001', 20, false) },
                { html: '<span class="govuk-tag govuk-tag--blue">Attended</span>' },
                {
                  html: '<a href="/group-123/session-456/session-1-attendance-and-session-notes?referralId=123&source=edit-session">Alex River: Session 1 notes</a>',
                },
              ],
            },
            {
              id: 'attendance-multi-select-row-1',
              value: '456',
              checkBoxLabel: 'Jane Doe',
              cells: [
                { html: nameCrnCellHtml('456', 'Jane Doe', 'CRN002', 20, true) },
                { html: '<span class="govuk-tag govuk-tag--red">Not attended</span>' },
                {
                  html: '<a href="/group-123/session-456/session-1-attendance-and-session-notes?referralId=456&source=edit-session">Jane Doe: Session 1 notes</a>',
                },
              ],
            },
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
      unformattedEndDate: '2026-02-01T14:00:00',
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

  describe('sessionType', () => {
    const buildSessionDetails = (overrides: Partial<GroupSessionResponse> = {}): GroupSessionResponse => ({
      pageTitle: 'Session 1',
      code: 'CODE-123',
      sessionType: 'Group',
      isCatchup: false,
      attendanceAndSessionNotes: [],
      date: '01 Feb 2026',
      time: '1:00pm',
      unformattedEndDate: '2026-02-01T14:00:00',
      scheduledToAttend: [],
      facilitators: [],
      ...overrides,
    })

    it('returns Catch-up when the session is a catch-up', () => {
      const presenter = new EditSessionPresenter(
        mockGroupId,
        buildSessionDetails({ sessionType: 'Group', isCatchup: true }),
        mockSessionId,
        mockDeleteUrl,
      )

      expect(presenter.sessionType).toBe('Catch-up')
    })

    it('returns the raw session type when the session is not a catch-up', () => {
      const presenter = new EditSessionPresenter(
        mockGroupId,
        buildSessionDetails({ sessionType: 'Group', isCatchup: false }),
        mockSessionId,
        mockDeleteUrl,
      )

      expect(presenter.sessionType).toBe('Group')
    })
  })

  describe('canBeDeleted', () => {
    beforeEach(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2026-05-17T11:58:00'))
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
      date: 'Sunday 17 May 2126',
      unformattedEndDate: '2126-05-17T13:00:00',
      time: '11:00am to 1:00pm',
      scheduledToAttend: [],
      facilitators: [],
      ...overrides,
    })

    it('returns false when individual session end date/time has passed', () => {
      const presenter = new EditSessionPresenter(
        mockGroupId,
        buildSessionDetails({
          date: 'Sunday 17 May 2026',
          time: '10:00am to 11:00am',
          unformattedEndDate: '2026-05-17T11:00:00',
        }),
        mockSessionId,
        mockDeleteUrl,
      )
      expect(presenter.canBeDeleted).toBe(false)
    })

    it('returns true when individual session start date/time is in the past and the end date/time is in the future', () => {
      // Current time 2026-05-17T11:58:00
      // Session start date 2026-05-17T10:00:00
      // Session end date 2026-05-17T13:00:00
      const presenter = new EditSessionPresenter(mockGroupId, buildSessionDetails(), mockSessionId, mockDeleteUrl)

      expect(presenter.canBeDeleted).toBe(true)
    })

    it('returns false when end date time equals current time exactly', () => {
      const presenter = new EditSessionPresenter(
        mockGroupId,
        buildSessionDetails({
          unformattedEndDate: '2026-05-17T11:58:00', // Exact current time
        }),
        mockSessionId,
        mockDeleteUrl,
      )

      expect(presenter.canBeDeleted).toBe(false)
    })

    it('returns false when session type is core group (e.g. Getting started 1)', () => {
      const presenter = new EditSessionPresenter(
        mockGroupId,
        buildSessionDetails({ sessionType: 'Group', isCatchup: false }),
        mockSessionId,
        mockDeleteUrl,
      )

      expect(presenter.canBeDeleted).toBe(false)
    })

    it('returns true when session type is group catch up (e.g. Getting started 1 catch-up)', () => {
      const presenter = new EditSessionPresenter(
        mockGroupId,
        buildSessionDetails({ sessionType: 'Group', isCatchup: true }),
        mockSessionId,
        mockDeleteUrl,
      )

      expect(presenter.canBeDeleted).toBe(true)
    })

    it('returns true when session type is Individual (e.g. Pre-group one-to-one)', () => {
      const presenter = new EditSessionPresenter(
        mockGroupId,
        buildSessionDetails({ sessionType: 'Individual', isCatchup: false }),
        mockSessionId,
        mockDeleteUrl,
      )

      expect(presenter.canBeDeleted).toBe(true)
    })

    it('returns false when session type is not individual', () => {
      const presenter = new EditSessionPresenter(
        mockGroupId,
        buildSessionDetails({ sessionType: 'Individual', isCatchup: true }),
        mockSessionId,
        mockDeleteUrl,
      )

      expect(presenter.canBeDeleted).toBe(true)
    })

    it('returns true when no attendance has been recorded', () => {
      const presenter = new EditSessionPresenter(
        mockGroupId,
        buildSessionDetails({
          sessionType: 'Group',
          isCatchup: true,
          attendanceAndSessionNotes: [
            {
              name: 'Chase Gottlieb',
              referralId: 'c9cefced-480a-42aa-ac5c-d49ac242b759',
              crn: 'S347158170',
              attendance: 'To be confirmed',
              sessionNotes: '',
              lao: false,
            },
            {
              name: 'Clarita Hermann',
              referralId: '3c039300-380f-4aab-9196-5a48a9f0a933',
              crn: 'S512196735',
              attendance: 'To be confirmed',
              sessionNotes: '',
              lao: false,
            },
            {
              name: 'Daine Lehner',
              referralId: '69342294-7b88-47ac-b1fc-a55d2b6733b2',
              crn: 'S085511223',
              attendance: 'To be confirmed',
              sessionNotes: '',
              lao: false,
            },
          ],
        }),
        mockSessionId,
        mockDeleteUrl,
      )

      expect(presenter.canBeDeleted).toBe(true)
    })

    it('returns false when attendance has been recorded', () => {
      const presenter = new EditSessionPresenter(
        mockGroupId,
        buildSessionDetails({
          sessionType: 'Group',
          isCatchup: true,
          attendanceAndSessionNotes: [
            {
              name: 'Chase Gottlieb',
              referralId: 'c9cefced-480a-42aa-ac5c-d49ac242b759',
              crn: 'S347158170',
              attendance: 'To be confirmed',
              sessionNotes: '',
              lao: false,
            },
            {
              name: 'Clarita Hermann',
              referralId: '3c039300-380f-4aab-9196-5a48a9f0a933',
              crn: 'S512196735',
              attendance: 'Attended - Failed to Comply',
              sessionNotes: '',
              lao: false,
            },
            {
              name: 'Daine Lehner',
              referralId: '69342294-7b88-47ac-b1fc-a55d2b6733b2',
              crn: 'S085511223',
              attendance: 'To be confirmed',
              sessionNotes: '',
              lao: false,
            },
          ],
        }),
        mockSessionId,
        mockDeleteUrl,
      )

      expect(presenter.canBeDeleted).toBe(false)
    })

    it('returns true when no referrals are allocated, the session end is in the future and is a group catch up', () => {
      const presenter = new EditSessionPresenter(
        mockGroupId,
        buildSessionDetails({
          sessionType: 'Group',
          isCatchup: true,
          attendanceAndSessionNotes: [],
        }),
        mockSessionId,
        mockDeleteUrl,
      )

      expect(presenter.canBeDeleted).toBe(true)
    })
  })

  describe('errorSummary', () => {
    const buildSessionDetails = (overrides: Partial<GroupSessionResponse> = {}): GroupSessionResponse => ({
      pageTitle: 'Session 1',
      code: 'CODE-123',
      sessionType: 'Group',
      isCatchup: false,
      attendanceAndSessionNotes: [
        {
          referralId: 'ref-1',
          name: 'Alex River',
          crn: 'CRN001',
          attendance: 'Attended',
          sessionNotes: '',
          lao: false,
        },
        {
          referralId: 'ref-2',
          name: 'Jane Doe',
          crn: 'CRN002',
          attendance: 'Not attended',
          sessionNotes: '',
          lao: false,
        },
      ],
      date: '01 Feb 2026',
      time: '1:00pm',
      unformattedEndDate: '2126-05-17T13:00:00',
      scheduledToAttend: [],
      facilitators: [],
      ...overrides,
    })

    it('returns null when there is no validation error', () => {
      const presenter = new EditSessionPresenter(mockGroupId, buildSessionDetails(), mockSessionId, mockDeleteUrl)

      expect(presenter.errorSummary).toBeNull()
    })

    it('remaps multi-select-selected error field to the first row id from attendanceTableArgs', () => {
      const validationError: FormValidationError = {
        errors: [
          {
            formFields: ['multi-select-selected'],
            errorSummaryLinkedField: 'multi-select-selected',
            message: 'Select at least one person',
          },
        ],
      }
      const presenter = new EditSessionPresenter(
        mockGroupId,
        buildSessionDetails(),
        mockSessionId,
        mockDeleteUrl,
        null,
        null,
        false,
        validationError,
      )

      expect(presenter.errorSummary).toEqual([
        { field: 'multi-select-attendance-multi-select-row-0', message: 'Select at least one person' },
      ])
    })

    it('leaves other error fields untouched when remapping multi-select-selected', () => {
      const validationError: FormValidationError = {
        errors: [
          {
            formFields: ['some-field'],
            errorSummaryLinkedField: 'some-field',
            message: 'Some other error',
          },
          {
            formFields: ['multi-select-selected'],
            errorSummaryLinkedField: 'multi-select-selected',
            message: 'Select at least one person',
          },
        ],
      }
      const presenter = new EditSessionPresenter(
        mockGroupId,
        buildSessionDetails(),
        mockSessionId,
        mockDeleteUrl,
        null,
        null,
        false,
        validationError,
      )

      expect(presenter.errorSummary).toEqual([
        { field: 'some-field', message: 'Some other error' },
        { field: 'multi-select-attendance-multi-select-row-0', message: 'Select at least one person' },
      ])
    })
  })
})
