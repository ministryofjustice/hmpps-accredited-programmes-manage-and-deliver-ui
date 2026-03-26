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
      '/group/b2c3d4e5-f6a7-8901-bcde-f23456789012/session/c3d4e5f6-a7b8-9012-cdef-345678901234/building-motivation-session-notes',
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
      '/group/b2c3d4e5-f6a7-8901-bcde-f23456789012/session/c3d4e5f6-a7b8-9012-cdef-345678901234/introduction-to-building-choices-session-notes',
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
      '/group/b2c3d4e5-f6a7-8901-bcde-f23456789012/session/c3d4e5f6-a7b8-9012-cdef-345678901234/building-motivation-catch-up-session-notes',
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
      '/group/b2c3d4e5-f6a7-8901-bcde-f23456789012/session/c3d4e5f6-a7b8-9012-cdef-345678901234/getting-started-one-to-one-session-notes',
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
      '/group/b2c3d4e5-f6a7-8901-bcde-f23456789012/session/c3d4e5f6-a7b8-9012-cdef-345678901234/post-programme-review-for-jane-doe-session-notes',
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
      successMessage: 'Attendance recorded for Jane Doe',
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
      text: 'Attendance recorded for Alex River',
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

  it('returns backlink to attendance history when opened from PoP attendance history flow', () => {
    const presenter = new SessionNotesPresenter(buildData({ isAttendanceHistory: true }))

    expect(presenter.backLinkArgs).toEqual({
      text: 'Back to Attendance history',
      href: '/referral/referral-123/attendance-history',
    })
  })
})
