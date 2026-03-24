import SessionNotesPresenter, { SessionNotesData } from './sessionNotesPresenter'

describe('SessionNotesPresenter', () => {
  const buildData = (overrides: Partial<SessionNotesData> = {}): SessionNotesData => ({
    pageTitle: 'Jane Doe: Building Motivation session notes',
    moduleName: 'Getting started',
    sessionNumber: 1,
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

  it('builds core group URL from module name and module number', () => {
    const presenter = new SessionNotesPresenter(buildData())

    expect(presenter.pageUrl).toBe(
      '/group/b2c3d4e5-f6a7-8901-bcde-f23456789012/session/c3d4e5f6-a7b8-9012-cdef-345678901234/getting-started-1-session-notes',
    )
  })

  it('builds catch-up URL from session name and appends session-notes', () => {
    const presenter = new SessionNotesPresenter(
      buildData({ pageTitle: 'Jane Doe: Building Motivation catch-up session notes' }),
    )

    expect(presenter.pageUrl).toBe(
      '/group/b2c3d4e5-f6a7-8901-bcde-f23456789012/session/c3d4e5f6-a7b8-9012-cdef-345678901234/building-motivation-catch-up-session-notes',
    )
  })

  it('builds one-to-one URL from session name and appends session-notes', () => {
    const presenter = new SessionNotesPresenter(
      buildData({ pageTitle: 'Jane Doe: Getting started one-to-one session notes' }),
    )

    expect(presenter.pageUrl).toBe(
      '/group/b2c3d4e5-f6a7-8901-bcde-f23456789012/session/c3d4e5f6-a7b8-9012-cdef-345678901234/getting-started-one-to-one-session-notes',
    )
  })

  it('builds post-programme review URL from session name and appends session-notes', () => {
    const presenter = new SessionNotesPresenter(
      buildData({ pageTitle: 'Jane Doe: Post-programme review for Jane Doe session notes' }),
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
})
