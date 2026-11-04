import { Request, Response } from 'express'
import { SessionNotes } from '@manage-and-deliver-api'
import BaseController from '../shared/baseController'
import { PrimaryNavigationTab } from '../shared/routes/layoutPresenter'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import { FormValidationError } from '../utils/formValidationError'
import SessionNotesView from './sessionNotesView'
import SessionNotesPresenter, { SessionNotesData } from './sessionNotesPresenter'
import sendAuditEvent from '../services/auditService'

export default class SessionNotesController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Groups

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

  async showSessionNotesPage(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { sessionId } = req.params as Record<string, string>
    const referralId = req.query.referralId as string | undefined
    const source = req.query.source as string | undefined
    const isAttendanceHistory = req.query.isAttendanceHistory === 'true'

    if (!referralId) {
      return res.redirect(`/${req.params.groupId}/${sessionId}/edit-session`)
    }

    if (source === 'edit-session') {
      this.seedAttendanceSelection(req, referralId)
    }

    if (req.method === 'POST') {
      this.seedAttendanceSelection(req, referralId)
      return res.redirect(`/${req.params.groupId}/${sessionId}/record-attendance`)
    }
    if (req.method === 'GET') {
      await sendAuditEvent('VIEW_SESSION_NOTES_DATA', username, sessionId, 'SEARCH_TERM', {
        referralId,
      })
    }
    const sessionNotesBffData = await this.getSessionNotesData(req, username, sessionId, referralId)

    const sessionNotesData: SessionNotesData = {
      ...sessionNotesBffData,
      referralId,
      isAttendanceHistory,
      source,
      isSaved: req.query.saved === 'true',
      personOnProbationName: (req.query.personOnProbationName as string | undefined) || undefined,
    }

    return this.renderSessionNotesPage(res, sessionNotesData)
  }

  private async getSessionNotesData(
    req: Request,
    username: string,
    sessionId: string,
    referralId: string,
  ): Promise<SessionNotes> {
    const cachedData = this.getCachedSessionNotes(req, sessionId, referralId)
    if (cachedData) {
      return cachedData
    }

    const sessionNotesBffData = await this.accreditedProgrammesManageAndDeliverService.getSessionNotes(
      username,
      sessionId,
      referralId,
    )

    this.setCachedSessionNotes(req, sessionId, referralId, sessionNotesBffData)

    return sessionNotesBffData
  }

  private getCachedSessionNotes(req: Request, sessionId: string, referralId: string): SessionNotes | null {
    const cache = req.session.sessionNotesCache
    if (cache && cache.sessionId === sessionId && cache.referralId === referralId) {
      return cache.data
    }
    return null
  }

  private setCachedSessionNotes(req: Request, sessionId: string, referralId: string, data: SessionNotes): void {
    req.session.sessionNotesCache = {
      sessionId,
      referralId,
      data,
    }
  }

  private clearCachedSessionNotes(req: Request, sessionId: string, referralId: string): void {
    const cache = req.session.sessionNotesCache
    if (cache && cache.sessionId === sessionId && cache.referralId === referralId) {
      delete req.session.sessionNotesCache
    }
  }

  private seedAttendanceSelection(req: Request, referralId: string): void {
    const existingSelection = req.session.editSessionAttendance
    const attendeesForSelectedReferral = (existingSelection?.attendees ?? []).filter(
      attendee => attendee.referralId === referralId,
    )

    req.session.editSessionAttendance = {
      ...existingSelection,
      source: 'session-notes',
      attendees: attendeesForSelectedReferral,
      referralIds: [referralId],
    }
  }

  private renderSessionNotesPage(
    res: Response,
    sessionNotesData: SessionNotesData,
    validationError: FormValidationError | null = null,
  ): void {
    const presenter = new SessionNotesPresenter(sessionNotesData, validationError)
    const view = new SessionNotesView(presenter)

    this.renderPage(res, view)
  }
}
