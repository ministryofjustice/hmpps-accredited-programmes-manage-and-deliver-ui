import { Request } from 'express'
import { SessionNotes } from '@manage-and-deliver-api'

export default class SessionNotesForm {
  constructor(private readonly request: Request) {}

  getCachedSessionNotes(sessionId: string, referralId: string): SessionNotes | null {
    const cache = this.request.session.sessionNotesCache
    if (cache && cache.sessionId === sessionId && cache.referralId === referralId) {
      return cache.data
    }
    return null
  }

  setCachedSessionNotes(sessionId: string, referralId: string, data: SessionNotes): void {
    this.request.session.sessionNotesCache = {
      sessionId,
      referralId,
      data,
    }
  }
}
