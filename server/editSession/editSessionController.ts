import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import EditSessionPresenter from './editSessionPresenter'
import EditSessionView from './editSessionView'
import DeleteSessionPresenter from './deleteSession/deleteSessionPresenter'
import DeleteSessionView from './deleteSession/deleteSessionView'
import EditSessionAttendanceWhoPresenter from './editSessionAttendanceWho/editSessionAttendanceWhoPresenter'
import EditSessionAttendanceWhoView from './editSessionAttendanceWho/editSessionAttendanceWhoView'
import { FormValidationError } from '../utils/formValidationError'
import EditSessionForm from './editSessionForm'

export default class EditSessionController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async editSession(req: Request, res: Response): Promise<void> {
    const { groupId, sessionId } = req.params
    const { username } = req.user

    const sessionDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupSessionDetails(
      username,
      groupId,
      sessionId,
    )

    req.session.originPage = req.path

    const presenter = new EditSessionPresenter(
      groupId,
      sessionId,
      sessionDetails,
      `/group/${groupId}/sessionId/${sessionId}/delete-session`,
    )
    const view = new EditSessionView(presenter)

    ControllerUtils.renderWithLayout(res, view, null)
  }

  async deleteSession(req: Request, res: Response): Promise<void> {
    const { groupId, sessionId } = req.params
    const { username } = req.user

    let formError: FormValidationError | null = null

    if (req.method === 'POST') {
      const data = await new EditSessionForm(req).deleteData()
      if (data.error) {
        res.status(400)
        formError = data.error
      } else if (data.paramsForUpdate?.delete === 'yes') {
        const response = await this.accreditedProgrammesManageAndDeliverService.deleteSession(username, sessionId)
        return res.redirect(`/group/${groupId}/sessions-and-attendance?successMessage=${response.caption}`)
      } else {
        return res.redirect(req.session.originPage)
      }
    }

    const sessionDetails = await this.accreditedProgrammesManageAndDeliverService.getSessionDetails(username, sessionId)

    const presenter = new DeleteSessionPresenter(groupId, req.session.originPage, sessionDetails, formError)
    const view = new DeleteSessionView(presenter)

    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async editSessionAttendanceWho(req: Request, res: Response): Promise<void> {
    const { groupId, sessionId } = req.params
    const { username } = req.user

    let formError: FormValidationError | null = null

    if (req.method === 'POST') {
      const data = await new EditSessionForm(req).attendanceWhoData()
      if (data.error) {
        res.status(400)
        formError = data.error
      } else {
        await this.accreditedProgrammesManageAndDeliverService.updateSessionAttendees(
          username,
          sessionId,
          data.paramsForUpdate.referralId,
        )
        return res.redirect(`/group/${groupId}/sessions-and-attendance`)
      }
    }

    const sessionDetails = await this.accreditedProgrammesManageAndDeliverService.getSessionDetails(username, sessionId)
    const backUrl = `/group/${groupId}/sessionId/${sessionId}/edit-session`

    const presenter = new EditSessionAttendanceWhoPresenter(groupId, backUrl, sessionDetails, formError, req.body)
    const view = new EditSessionAttendanceWhoView(presenter)

    return ControllerUtils.renderWithLayout(res, view, null)
  }
}
