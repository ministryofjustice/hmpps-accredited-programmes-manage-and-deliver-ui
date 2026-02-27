import { ScheduleSessionRequest } from '@manage-and-deliver-api'
import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import { FormValidationError } from '../utils/formValidationError'

import SessionScheduleAttendancePresenter from './sessionAttendance/sessionScheduleAttendancePresenter'
import SessionScheduleAttendanceView from './sessionAttendance/sessionScheduleAttendanceView'
import SessionScheduleCyaPresenter from './sessionCya/SessionScheduleCyaPresenter'
import SessionScheduleCyaView from './sessionCya/sessionScheduleCyaView'
import AddSessionDetailsPresenter from './sessionDetails/addSessionDetailsPresenter'
import AddSessionDetailsView from './sessionDetails/addSessionDetailsView'
import CreateSessionScheduleForm from './sessionScheduleForm'
import SessionScheduleWhichPresenter from './sessionWhich/sessionScheduleWhichPresenter'
import SessionScheduleWhichView from './sessionWhich/sessionScheduleWhichView'

export default class SessionScheduleController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showSessionSchedule(req: Request, res: Response): Promise<void> {
    const { groupId, moduleId } = req.params
    const { username } = req.user
    let formError: FormValidationError | null = null

    const scheduleSessionTypeResponse = await this.accreditedProgrammesManageAndDeliverService.getSessionTemplates(
      username,
      groupId,
      moduleId,
    )

    if (req.method === 'POST') {
      const selectedSession = req.body['session-template']

      if (!selectedSession) {
        res.status(400)
        formError = {
          errors: [
            {
              formFields: ['session-template'],
              errorSummaryLinkedField: 'session-template',
              message: 'Select a session',
            },
          ],
        }
      } else {
        const [selectedSessionTemplateId, selectedSessionTemplateType, sessionName] = selectedSession.split('+')
        req.session.sessionScheduleData = {
          sessionTemplateId: selectedSessionTemplateId,
          headingText: scheduleSessionTypeResponse.pageHeading,
          sessionScheduleType: selectedSessionTemplateType,
          sessionName,
          selectedSession,
        }
        return res.redirect(`/group/${groupId}/module/${moduleId}/schedule-group-session-details`)
      }
    }
    const presenter = new SessionScheduleWhichPresenter(
      groupId,
      scheduleSessionTypeResponse,
      formError,
      req.session.sessionScheduleData?.selectedSession,
    )
    const view = new SessionScheduleWhichView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async scheduleGroupSessionDetails(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { groupId, moduleId } = req.params
    const { sessionScheduleData } = req.session
    let formError: FormValidationError | null = null
    let userInputData = null

    if (req.method === 'POST') {
      const data = await new CreateSessionScheduleForm(req).sessionDetailsData()
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        req.session.sessionScheduleData = {
          ...sessionScheduleData,
          referralIds: data.paramsForUpdate.referralIds,
          facilitators: data.paramsForUpdate.facilitators,
          startDate: data.paramsForUpdate.startDate,
          startTime: data.paramsForUpdate.startTime,
          endTime: data.paramsForUpdate.endTime,
          referralName: req.body['session-details-who'].split('+')[1].trim(),
        }
        return res.redirect(`/group/${groupId}/module/${moduleId}/session-review-details`)
      }
    }

    const sessionDetails = await this.accreditedProgrammesManageAndDeliverService.getIndividualSessionDetails(
      username,
      groupId,
      moduleId,
    )
    const backLink = `/group/${groupId}/module/${moduleId}/schedule-session-type`
    const presenter = new AddSessionDetailsPresenter(
      sessionDetails,
      backLink,
      formError,
      sessionScheduleData,
      userInputData,
    )
    const view = new AddSessionDetailsView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async scheduleGroupSessionCya(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { groupId, moduleId } = req.params
    const { sessionScheduleData } = req.session

    if (req.method === 'POST') {
      const { sessionName, referralName, ...sessionDataForApi } = sessionScheduleData
      sessionDataForApi.startDate = (() => {
        const [day, month, year] = sessionScheduleData.startDate.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      })()
      const response = await this.accreditedProgrammesManageAndDeliverService.createSessionSchedule(
        username,
        groupId,
        sessionDataForApi as ScheduleSessionRequest,
      )

      const successMessage = response || 'Session has been added.'

      req.session.sessionScheduleData = {}
      return res.redirect(
        `/group/${groupId}/sessions-and-attendance?successMessage=${encodeURIComponent(successMessage)}`,
      )
    }

    const presenter = new SessionScheduleCyaPresenter(`/group/${groupId}/module/${moduleId}`, sessionScheduleData)
    const view = new SessionScheduleCyaView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async showSessionAttendance(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { groupId } = req.params
    const { successMessage } = req.query as {
      successMessage?: string
    }

    const sessionAttendanceData = await this.accreditedProgrammesManageAndDeliverService.getGroupSessionsAndAttendance(
      username,
      groupId,
    )

    console.log(JSON.stringify(sessionAttendanceData, null, 2))

    const presenter = new SessionScheduleAttendancePresenter(groupId, sessionAttendanceData, successMessage)
    const view = new SessionScheduleAttendanceView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }
}
