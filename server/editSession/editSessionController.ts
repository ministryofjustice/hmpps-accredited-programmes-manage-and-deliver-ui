import { Request, Response } from 'express'
import { RescheduleSessionRequest } from '@manage-and-deliver-api'
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
import EditSessionDateAndTimePresenter from './dateAndTime/editSessionDateAndTimePresenter'
import EditSessionDateAndTimeView from './dateAndTime/editSessionDateAndTimeView'
import EditSessionDateAndTimeFormForm from './dateAndTime/editSessionDateAndTimeForm'
import OtherSessionsPresenter from './dateAndTime/otherSessionsPresenter'
import OtherSessionsView from './dateAndTime/otherSessionsView'
import RescheduleOtherSessionsForm from './dateAndTime/rescheduleOtherSessionsForm'

export default class EditSessionController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async editSession(req: Request, res: Response): Promise<void> {
    const { groupId, sessionId } = req.params
    const { username } = req.user
    const { message } = req.query

    const sessionDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupSessionDetails(
      username,
      groupId,
      sessionId,
    )

    const successMessage = message ? String(message) : null
    req.session.originPage = req.path

    const presenter = new EditSessionPresenter(
      groupId,
      sessionId,
      sessionDetails,
      `/group/${groupId}/sessionId/${sessionId}/delete-session`,
      successMessage,
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

  async editSessionDateAndTime(req: Request, res: Response): Promise<void> {
    const { groupId, sessionId } = req.params
    const { username } = req.user
    let formError: FormValidationError | null = null
    let userInputData = null

    const sessionDetails = await this.accreditedProgrammesManageAndDeliverService.getSessionEditDateAndTime(
      username,
      sessionId,
    )

    if (req.method === 'POST') {
      const data = await new EditSessionDateAndTimeFormForm(req).rescheduleSessionDetailsData()
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        req.session.editSessionDateAndTime = {
          sessionStartDate: data.paramsForUpdate.sessionStartDate,
          sessionStartTime: data.paramsForUpdate.sessionStartTime,
          sessionEndTime: data.paramsForUpdate.sessionEndTime,
        }
        return res.redirect(`/group/${groupId}/session/${sessionId}/edit-session-date-and-time/reschedule`)
      }
    }

    const presenter = new EditSessionDateAndTimePresenter(
      groupId,
      sessionDetails,
      req.session.editSessionDateAndTime,
      formError,
      userInputData,
    )
    const view = new EditSessionDateAndTimeView(presenter)

    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async submitEditSessionDateAndTime(req: Request, res: Response): Promise<void> {
    const { groupId, sessionId } = req.params
    const { username } = req.user
    let formError: FormValidationError | null = null

    const sessionDetails = await this.accreditedProgrammesManageAndDeliverService.getRescheduleSessionDetails(
      username,
      sessionId,
    )

    if (req.method === 'POST') {
      const data = await new RescheduleOtherSessionsForm(req).rescheduleSessionDetailsData()
      if (data.error) {
        res.status(400)
        formError = data.error
      } else {
        req.session.editSessionDateAndTime.rescheduleOtherSessions = data.paramsForUpdate.rescheduleOtherSessions
        req.session.editSessionDateAndTime.sessionStartDate = (() => {
          const [day, month, year] = req.session.editSessionDateAndTime.sessionStartDate.split('/')
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        })()
        const message = await this.accreditedProgrammesManageAndDeliverService.updateSessionDateAndTime(
          username,
          sessionDetails.sessionId,
          req.session.editSessionDateAndTime as RescheduleSessionRequest,
        )

        return res.redirect(`/group/${groupId}/sessionId/${sessionId}/edit-session?message=${message.message}`)
      }
    }

    const presenter = new OtherSessionsPresenter(groupId, sessionDetails, req.session.editSessionDateAndTime, formError)
    const view = new OtherSessionsView(presenter)

    return ControllerUtils.renderWithLayout(res, view, null)
  }
}
