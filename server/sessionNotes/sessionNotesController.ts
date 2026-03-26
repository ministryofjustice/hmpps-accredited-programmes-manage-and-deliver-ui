import { Request, Response } from 'express'
import { SessionAttendance } from '@manage-and-deliver-api'
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

    if (req.method === 'POST') {
      const submittedNotes = ((req.body.sessionNotes as string | undefined) || '').trim()

      const attendanceBffData = await this.accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData(
        username,
        sessionId,
        [referralId],
      )

      const attendee = attendanceBffData.people.find(person => person.referralId === referralId)
      const outcomeCode = attendee?.attendance?.code as
        | SessionAttendance['attendees'][number]['outcomeCode']
        | undefined

      if (!outcomeCode) {
        return res.redirect(`/group/${req.params.groupId}/session/${sessionId}/edit-session`)
      }

      await this.accreditedProgrammesManageAndDeliverService.createSessionAttendance(username, sessionId, {
        attendees: [{ referralId, outcomeCode, sessionNotes: submittedNotes }],
      })

      const redirectQuery = new URLSearchParams({
        referralId,
        saved: 'true',
        personOnProbationName: attendee?.name ?? '',
      })
      return res.redirect(`${req.path}?${redirectQuery.toString()}`)
    }

    const sessionNotesData: SessionNotesData = {
      ...sessionNotesBffData,
      referralId,
      isAttendanceHistory: req.query.isAttendanceHistory === 'true',
      isSaved: req.query.saved === 'true',
      personOnProbationName: (req.query.personOnProbationName as string | undefined) || undefined,
    }

    const presenter = new SessionNotesPresenter(sessionNotesData)
    const view = new SessionNotesView(presenter)

    return this.renderPage(res, view)
  }
}
