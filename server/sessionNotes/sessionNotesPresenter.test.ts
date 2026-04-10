import SessionNotesPresenter, { SessionNotesData } from './sessionNotesPresenter'

describe('SessionNotesPresenter', () => {
  const buildData = (overrides: Partial<SessionNotesData> = {}): SessionNotesData => ({
    pageTitle: 'Jane Doe: Building Motivation session notes',
    moduleName: 'Getting started',
    sessionName: 'Building Motivation',
    sessionNumber: 1,
    referralId: 'referral-123',
    lastUpdatedBy: 'Berta Tonka',
    lastUpdatedDate: '2025-09-03',
    groupId: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    sessionId: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
    sessionDate: '2025-07-21',
    sessionAttendance: 'ABSENT',
    sessionNotes: 'Participant engaged well.',
    isAttendanceHistory: false,
    ...overrides,
  })

  it('builds URL from sessionName', () => {
    const presenter = new SessionNotesPresenter(buildData())

    expect(presenter.pageUrl).toBe(
      '/group/b2c3d4e5-f6a7-8901-bcde-f23456789012/session/c3d4e5f6-a7b8-9012-cdef-345678901234/building-motivation/session-notes',
    )
  })

  it('builds URL from BFF sessionName when provided', () => {
    const presenter = new SessionNotesPresenter(
      buildData({
        sessionName: 'Introduction to Building Choices',
        pageTitle: 'Alex River: Getting started 1 Introduction to Building Choices session notes',
      }),
    )

    expect(presenter.pageUrl).toBe(
      '/group/b2c3d4e5-f6a7-8901-bcde-f23456789012/session/c3d4e5f6-a7b8-9012-cdef-345678901234/introduction-to-building-choices/session-notes',
    )
  })

  it('builds catch-up URL from session name and appends session-notes', () => {
    const presenter = new SessionNotesPresenter(
      buildData({
        sessionName: 'Building Motivation catch-up',
        pageTitle: 'Jane Doe: Building Motivation catch-up session notes',
      }),
    )

    expect(presenter.pageUrl).toBe(
      '/group/b2c3d4e5-f6a7-8901-bcde-f23456789012/session/c3d4e5f6-a7b8-9012-cdef-345678901234/building-motivation-catch-up/session-notes',
    )
  })

  it('builds one-to-one URL from session name and appends session-notes', () => {
    const presenter = new SessionNotesPresenter(
      buildData({
        sessionName: 'Getting started one-to-one',
        pageTitle: 'Jane Doe: Getting started one-to-one session notes',
      }),
    )

    expect(presenter.pageUrl).toBe(
      '/group/b2c3d4e5-f6a7-8901-bcde-f23456789012/session/c3d4e5f6-a7b8-9012-cdef-345678901234/getting-started-one-to-one/session-notes',
    )
  })

  it('builds post-programme review URL from session name and appends session-notes', () => {
    const presenter = new SessionNotesPresenter(
      buildData({
        sessionName: 'Post-programme review for Jane Doe',
        pageTitle: 'Jane Doe: Post-programme review for Jane Doe session notes',
      }),
    )

    expect(presenter.pageUrl).toBe(
      '/group/b2c3d4e5-f6a7-8901-bcde-f23456789012/session/c3d4e5f6-a7b8-9012-cdef-345678901234/post-programme-review-for-jane-doe/session-notes',
    )
  })

  it('returns full session notes data payload', () => {
    const data = buildData()
    const presenter = new SessionNotesPresenter(data)

    expect(presenter.sessionNotesData).toEqual(data)
  })

  it('returns view text content for session notes page copy', () => {
    const presenter = new SessionNotesPresenter(buildData())

    expect(presenter.text).toEqual({
      headingText: 'Jane Doe: Building Motivation session notes',
      personOnProbationName: 'Jane Doe',
      successMessage: 'Attendance recorded for Jane Doe.',
      lastUpdatedText: 'Last updated by Berta Tonka on 2025-09-03.',
      updateAttendanceAndNotesButtonText: 'Update attendance and notes',
      attendanceSummaryTitle: 'Attendance summary',
      sessionNotesTitle: 'Session notes',
      sessionName: 'Building Motivation',
    })
  })

  it('returns coloured attendance tag from the presenter', () => {
    const presenter = new SessionNotesPresenter(buildData({ sessionAttendance: 'Attended, failed to comply' }))

    expect(presenter.attendanceOptionText).toEqual({
      attendanceState: '<span class="govuk-tag govuk-tag--yellow">Attended - failed to comply</span>',
    })
  })

  it('returns successMessageSummary when saved', () => {
    const presenter = new SessionNotesPresenter(buildData({ isSaved: true, personOnProbationName: 'Alex River' }))

    expect(presenter.successMessageSummary).toEqual({
      title: '',
      text: 'Attendance recorded for Alex River.',
      variant: 'success',
      dismissible: true,
      showTitleAsHeading: true,
    })
  })

  it('returns null successMessageSummary when not saved', () => {
    const presenter = new SessionNotesPresenter(buildData({ isSaved: false }))

    expect(presenter.successMessageSummary).toBeNull()
  })

  it('returns backlink to sessions and attendance when opened from group session flow', () => {
    const presenter = new SessionNotesPresenter(buildData({ isAttendanceHistory: false }))

    expect(presenter.backLinkArgs).toEqual({
      text: 'Back to Sessions and attendance',
      href: '/group/b2c3d4e5-f6a7-8901-bcde-f23456789012/sessions-and-attendance',
    })
  })

  it('returns backlink to edit session when opened from edit session', () => {
    const presenter = new SessionNotesPresenter(buildData({ source: 'edit-session' }))

    expect(presenter.backLinkArgs).toEqual({
      text: 'Back to Getting started',
      href: '/group/b2c3d4e5-f6a7-8901-bcde-f23456789012/session/c3d4e5f6-a7b8-9012-cdef-345678901234/edit-session',
    })
  })

  it('returns field error message when session notes validation fails', () => {
    const presenter = new SessionNotesPresenter(buildData(), {
      errors: [
        {
          formFields: ['sessionNotes'],
          errorSummaryLinkedField: 'sessionNotes',
          message: 'Session notes must be 10,000 characters or fewer',
        },
      ],
    })

    expect(presenter.fields.sessionNotes.errorMessage).toBe('Session notes must be 10,000 characters or fewer')
    expect(presenter.errorSummary).toEqual([
      { field: 'sessionNotes', message: 'Session notes must be 10,000 characters or fewer' },
    ])
  })

  it('returns backlink to attendance history when opened from PoP attendance history flow', () => {
    const presenter = new SessionNotesPresenter(buildData({ isAttendanceHistory: true }))

    expect(presenter.backLinkArgs).toEqual({
      text: 'Back to Attendance history',
      href: '/referral/referral-123/attendance-history',
    })
  })

  it('returns page header actions configuration', () => {
    const presenter = new SessionNotesPresenter(buildData())

    expect(presenter.pageHeaderActionsArgs).toEqual({
      classes: 'govuk-!-margin-bottom-0',
      heading: {
        text: 'Jane Doe: Building Motivation session notes',
        classes: 'govuk-heading-l',
      },
      items: [
        {
          text: 'Update attendance and notes',
          classes: 'govuk-button--primary',
          element: 'button',
          type: 'submit',
          attributes: {
            form: 'session-notes-form',
          },
        },
      ],
    })
  })

  it('returns read-only page header action link when opened from edit session', () => {
    const presenter = new SessionNotesPresenter(buildData({ source: 'edit-session' }))

    expect(presenter.isReadOnly).toBe(true)
    expect(presenter.pageHeaderActionsArgs).toEqual({
      classes: 'govuk-!-margin-bottom-0',
      heading: {
        text: 'Jane Doe: Building Motivation session notes',
        classes: 'govuk-heading-l',
      },
      items: [
        {
          text: 'Update attendance and notes',
          classes: 'govuk-button--primary',
          href: '/group/b2c3d4e5-f6a7-8901-bcde-f23456789012/session/c3d4e5f6-a7b8-9012-cdef-345678901234/record-attendance?referralId=referral-123',
        },
      ],
    })
  })

  describe('getNotesRows', () => {
    it('returns minimum of 8 rows for empty string', () => {
      const presenter = new SessionNotesPresenter(buildData())

      expect(presenter.getNotesRows('')).toBe(8)
    })

    it('returns minimum of 8 rows for short single line', () => {
      const presenter = new SessionNotesPresenter(buildData())

      expect(presenter.getNotesRows('Short note')).toBe(8)
    })

    it('calculates rows correctly for single line under 100 characters', () => {
      const presenter = new SessionNotesPresenter(buildData())
      const note = 'a'.repeat(50) // 50 chars = 1 row

      expect(presenter.getNotesRows(note)).toBe(8)
    })

    it('calculates rows correctly for single line exactly 100 characters', () => {
      const presenter = new SessionNotesPresenter(buildData())
      const note = 'a'.repeat(100) // 100 chars = 1 row

      expect(presenter.getNotesRows(note)).toBe(8)
    })

    it('calculates rows correctly for single line over 100 characters', () => {
      const presenter = new SessionNotesPresenter(buildData())
      const note = 'a'.repeat(150) // 150 chars = 2 rows

      expect(presenter.getNotesRows(note)).toBe(8)
    })

    it('calculates rows correctly for single line of 250 characters', () => {
      const presenter = new SessionNotesPresenter(buildData())
      const note = 'a'.repeat(250) // 250 chars = 3 rows (ceil(250/100) = 3)

      expect(presenter.getNotesRows(note)).toBe(8)
    })

    it('calculates rows for multiple short lines', () => {
      const presenter = new SessionNotesPresenter(buildData())
      const note = 'Line 1\nLine 2\nLine 3' // 3 lines of ~6 chars each = 3 rows minimum, so 8

      expect(presenter.getNotesRows(note)).toBe(8)
    })

    it('calculates rows for multiple lines with varying lengths', () => {
      const presenter = new SessionNotesPresenter(buildData())
      const line100 = 'a'.repeat(100)
      const line50 = 'a'.repeat(50)
      const note = `${line100}\n${line50}` // 1 + 1 = 2 rows, return 8

      expect(presenter.getNotesRows(note)).toBe(8)
    })

    it('calculates rows for note with multiple long lines', () => {
      const presenter = new SessionNotesPresenter(buildData())
      const line = 'a'.repeat(250) // 3 rows each
      const note = `${line}\n${line}\n${line}` // 3 + 3 + 3 = 9 rows

      expect(presenter.getNotesRows(note)).toBe(9)
    })

    it('calculates rows correctly with \\r\\n line breaks', () => {
      const presenter = new SessionNotesPresenter(buildData())
      const line = 'a'.repeat(300) // 3 rows
      const note = `${line}\r\n${line}` // 3 + 3 = 6 rows, return 8

      expect(presenter.getNotesRows(note)).toBe(8)
    })

    it('calculates rows correctly with \\r line breaks', () => {
      const presenter = new SessionNotesPresenter(buildData())
      const line = 'a'.repeat(300) // 3 rows
      const note = `${line}\r${line}\r${line}` // 3 + 3 + 3 = 9 rows

      expect(presenter.getNotesRows(note)).toBe(9)
    })

    it('returns maximum of 50 rows for very long notes', () => {
      const presenter = new SessionNotesPresenter(buildData())
      const line = 'a'.repeat(500) // 5 rows each
      const note = Array(15).fill(line).join('\n') // 15 * 5 = 75 rows, capped at 50

      expect(presenter.getNotesRows(note)).toBe(50)
    })

    it('calculates rows correctly for note with 17 rows exactly', () => {
      const presenter = new SessionNotesPresenter(buildData())
      const line = 'a'.repeat(200) // 2 rows each
      const note = Array(9).fill(line).join('\n') // 9 * 2 = 18 rows

      expect(presenter.getNotesRows(note)).toBe(18)
    })

    it('respects minimum boundary of 8 rows', () => {
      const presenter = new SessionNotesPresenter(buildData())

      expect(presenter.getNotesRows('')).toBe(8)
      expect(presenter.getNotesRows('a')).toBe(8)
      expect(presenter.getNotesRows('a'.repeat(100))).toBe(8)
    })

    it('respects maximum boundary of 50 rows', () => {
      const presenter = new SessionNotesPresenter(buildData())
      const line = 'a'.repeat(1000)
      const note = Array(100).fill(line).join('\n')

      expect(presenter.getNotesRows(note)).toBe(50)
    })
  })
})
