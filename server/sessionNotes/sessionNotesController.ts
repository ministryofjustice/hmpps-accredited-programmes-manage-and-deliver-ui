import { Request, Response } from 'express'
import { SessionAttendanceOutcomeCode, SessionNotes } from '@manage-and-deliver-api'
import BaseController from '../shared/baseController'
import { PrimaryNavigationTab } from '../shared/routes/layoutPresenter'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import { FormValidationError } from '../utils/formValidationError'
import SessionNotesView from './sessionNotesView'
import SessionNotesForm from './sessionNotesForm'
import SessionNotesPresenter, { SessionNotesData } from './sessionNotesPresenter'

export default class SessionNotesController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Groups

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

  async showSessionNotesPage(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { sessionId } = req.params
    const referralId = req.query.referralId as string | undefined
    const source = req.query.source as string | undefined
    const isAttendanceHistory = req.query.isAttendanceHistory === 'true'

    if (!referralId) {
      return res.redirect(`/group/${req.params.groupId}/session/${sessionId}/edit-session`)
    }

    if (source === 'edit-session') {
      this.seedAttendanceSelection(req, referralId)
    }

    if (req.method === 'POST') {
      const form = new SessionNotesForm()
      const submittedNotes = ((req.body.sessionNotes as string | undefined) || '').trim()
      const validationError = form.validateSessionNotes(submittedNotes)

      if (validationError) {
        res.status(400)
        const sessionNotesBffData = await this.getSessionNotesData(req, username, sessionId, referralId)

        return this.renderSessionNotesPage(
          res,
          {
            ...sessionNotesBffData,
            referralId,
            isAttendanceHistory,
            source,
            isSaved: req.query.saved === 'true',
            personOnProbationName: (req.query.personOnProbationName as string | undefined) || undefined,
            sessionNotes: submittedNotes,
          },
          validationError,
        )
      }

      const attendanceBffData = await this.accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData(
        username,
        sessionId,
        [referralId],
      )

      const attendee = attendanceBffData.people.find(person => person.referralId === referralId)
      const outcomeCode = attendee?.attendance?.code as SessionAttendanceOutcomeCode | undefined

      if (!outcomeCode) {
        return res.redirect(`/group/${req.params.groupId}/session/${sessionId}/edit-session`)
      }

      await this.accreditedProgrammesManageAndDeliverService.createSessionAttendance(username, sessionId, {
        attendees: [{ referralId, outcomeCode, sessionNotes: submittedNotes }],
      })

      this.clearCachedSessionNotes(req, sessionId, referralId)

      const redirectQuery = new URLSearchParams({
        referralId,
        saved: 'true',
        personOnProbationName: attendee?.name ?? '',
      })

      if (source === 'edit-session') {
        redirectQuery.set('source', source)
      }

      if (isAttendanceHistory) {
        redirectQuery.set('isAttendanceHistory', 'true')
      }

      return res.redirect(`${req.path}?${redirectQuery.toString()}`)
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

    let existingReferralIds: string[] = []

    if (Array.isArray(existingSelection?.referralIds)) {
      existingReferralIds = existingSelection.referralIds
    } else if (existingSelection?.referralIds) {
      existingReferralIds = [existingSelection.referralIds]
    }

    req.session.editSessionAttendance = {
      ...existingSelection,
      source: 'session-notes',
      attendees: existingSelection?.attendees ?? [],
      referralIds: existingReferralIds.length ? existingReferralIds : [referralId],
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
