import { Request, Response } from 'express'
import BaseController from '../shared/baseController'
import { PrimaryNavigationTab } from '../shared/routes/layoutPresenter'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import SessionNotesView from './sessionNotesView'
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

    if (!referralId) {
      return res.redirect(`/group/${req.params.groupId}/session/${sessionId}/edit-session`)
    }

    const sessionNotesBffData = await this.accreditedProgrammesManageAndDeliverService.getSessionNotes(
      username,
      sessionId,
      referralId,
    )

    const sessionNotesData: SessionNotesData = {
      ...sessionNotesBffData,
      isAttendanceHistory: false,
    }

    const presenter = new SessionNotesPresenter(sessionNotesData)
    const view = new SessionNotesView(presenter)

    return this.renderPage(res, view)
  }
}
