import { SessionNotes } from '@manage-and-deliver-api'
import { Request } from 'express'
import { SessionData } from 'express-session'
import SessionNotesForm from './sessionNotesForm'

describe('SessionNotesForm', () => {
  const buildRequest = (sessionData: Partial<SessionData> = {}): Request => {
    return { session: sessionData as SessionData } as Request
  }

  const sessionNotesData: SessionNotes = {
    pageTitle: 'Alex River: Session notes',
    moduleName: 'Getting started',
    sessionName: 'Introduction to Building Choices',
    sessionNumber: 1,
    lastUpdatedBy: 'John Smith',
    lastUpdatedDate: '19 March 2026',
    groupId: 'group-123',
    sessionId: 'session-456',
    sessionDate: '21 July 2025',
    sessionAttendance: 'Attended',
    sessionNotes: 'Participant engaged well.',
  }

  it('returns cached session notes when session and referral match', () => {
    const req = buildRequest({
      sessionNotesCache: {
        sessionId: 'session-456',
        referralId: 'referral-123',
        data: sessionNotesData,
      },
    })

    const form = new SessionNotesForm(req)

    expect(form.getCachedSessionNotes('session-456', 'referral-123')).toEqual(sessionNotesData)
  })

  it('returns null when cache does not match requested session/referral', () => {
    const req = buildRequest({
      sessionNotesCache: {
        sessionId: 'session-999',
        referralId: 'referral-123',
        data: sessionNotesData,
      },
    })

    const form = new SessionNotesForm(req)

    expect(form.getCachedSessionNotes('session-456', 'referral-123')).toBeNull()
  })

  it('stores session notes cache in session', () => {
    const req = buildRequest({})
    const form = new SessionNotesForm(req)

    form.setCachedSessionNotes('session-456', 'referral-123', sessionNotesData)

    expect(req.session.sessionNotesCache).toEqual({
      sessionId: 'session-456',
      referralId: 'referral-123',
      data: sessionNotesData,
    })
  })
})
