import { RescheduleSessionRequest } from '@manage-and-deliver-api'
import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import { FormValidationError } from '../utils/formValidationError'
import EditSessionDateAndTimeFormForm from './dateAndTime/sessionEditDateAndTimeForm'
import EditSessionDateAndTimePresenter from './dateAndTime/sessionEditDateAndTimePresenter'
import EditSessionDateAndTimeView from './dateAndTime/sessionEditDateAndTimeView'
import OtherSessionsPresenter from './dateAndTime/sessionEditOtherPresenter'
import OtherSessionsView from './dateAndTime/sessionEditOtherView'
import RescheduleOtherSessionsForm from './dateAndTime/sessionEditOtherRescheduleForm'
import DeleteSessionPresenter from './deleteSession/sessionDeletePresenter'
import DeleteSessionView from './deleteSession/sessionDeleteView'
import EditSessionForm from './sessionEditForm'
import EditSessionPresenter from './sessionEditPresenter'
import EditSessionView from './sessionEditView'
import EditSessionFacilitatorsForm from './facilitators/sessionEditFacilitatorsForm'
import EditSessionFacilitatorsPresenter from './facilitators/sessionEditFacilitatorsPresenter'
import EditSessionFacilitatorsView from './facilitators/sessionEditFacilitatorsView'
import EditSessionAttendeesPresenter from './attendees/sessionEditAttendeesPresenter'
import EditSessionAttendeesView from './attendees/sessionEditAttendeesView'

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
      sessionDetails,
      sessionId,
      `/group/${groupId}/session/${sessionId}/delete-session`,
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

  async editSessionAttendees(req: Request, res: Response): Promise<void> {
    const { groupId, sessionId } = req.params
    const { username } = req.user

    let formError: FormValidationError | null = null

    if (req.method === 'POST') {
      const data = await new EditSessionForm(req).attendeesData()
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

    const sessionAttendees = await this.accreditedProgrammesManageAndDeliverService.getSessionAttendees(
      username,
      sessionId,
    )

    const backUrl = `/group/${groupId}/sessionId/${sessionId}/edit-session`
    const presenter = new EditSessionAttendeesPresenter(groupId, backUrl, sessionAttendees, formError)
    const view = new EditSessionAttendeesView(presenter)

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
    const sessionAttendees = await this.accreditedProgrammesManageAndDeliverService.getSessionAttendees(
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

        // GROUP sessions and ONE_TO_ONE catch-ups go to the reschedule page
        if (sessionAttendees.sessionType === 'GROUP' && !sessionAttendees.isCatchup) {
          return res.redirect(`/group/${groupId}/session/${sessionId}/edit-session-date-and-time/reschedule`)
        }

        // For ONE_TO_ONE sessions, submit directly to API
        const [day, month, year] = data.paramsForUpdate.sessionStartDate.split('/')
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`

        const rescheduleRequest: RescheduleSessionRequest = {
          sessionStartDate: formattedDate,
          sessionStartTime: data.paramsForUpdate.sessionStartTime,
          sessionEndTime: data.paramsForUpdate.sessionEndTime,
          rescheduleOtherSessions: false,
        }

        await this.accreditedProgrammesManageAndDeliverService.updateSessionDateAndTime(
          username,
          sessionId,
          rescheduleRequest,
        )

        delete req.session.editSessionDateAndTime

        return res.redirect(`/group/${groupId}/sessions-and-attendance?successMessage=Session date and time updated`)
      }
    }

    const presenter = new EditSessionDateAndTimePresenter(
      groupId,
      sessionDetails,
      sessionAttendees.sessionType,
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

        return res.redirect(`/group/${groupId}/session/${sessionId}/edit-session?message=${message.message}`)
      }
    }

    const presenter = new OtherSessionsPresenter(groupId, sessionDetails, req.session.editSessionDateAndTime, formError)
    const view = new OtherSessionsView(presenter)

    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async editSessionFacilitators(req: Request, res: Response): Promise<void> {
    const { groupId, sessionId } = req.params
    const { username } = req.user
    let formError: FormValidationError | null = null
    let userInputData = null

    const editSessionFacilitators = await this.accreditedProgrammesManageAndDeliverService.getEditSessionFacilitators(
      username,
      sessionId,
    )

    if (req.method === 'POST') {
      const data = await new EditSessionFacilitatorsForm(req).editSessionFacilitatorsData()
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        req.session.sessionFacilitators = data.paramsForUpdate
        const message = await this.accreditedProgrammesManageAndDeliverService.updateSessionFacilitators(
          username,
          sessionId,
          req.session.sessionFacilitators,
        )
        return res.redirect(`/group/${groupId}/session/${sessionId}/edit-session?message=${message}`)
      }
    }
    const presenter = new EditSessionFacilitatorsPresenter(
      req.session.originPage,
      groupId,
      editSessionFacilitators,
      formError,
      userInputData,
    )
    const view = new EditSessionFacilitatorsView(presenter)

    return ControllerUtils.renderWithLayout(res, view, null)
  }
}
