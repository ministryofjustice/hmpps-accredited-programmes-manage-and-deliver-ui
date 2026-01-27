import { Request, Response } from 'express'
import { SessionScheduleRequest } from '@manage-and-deliver-api'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import { FormValidationError } from '../utils/formValidationError'

import SessionScheduleWhichPresenter from './sessionWhich/sessionScheduleWhichPresenter'
import SessionScheduleWhichView from './sessionWhich/sessionScheduleWhichView'
import AddSessionDetailsPresenter from './sessionDetails/addSessionDetailsPresenter'
import AddSessionDetailsView from './sessionDetails/addSessionDetailsView'
import CreateSessionScheduleForm from './sessionScheduleForm'
import SessionScheduleAttendancePresenter from './sessionAttendance/sessionScheduleAttendancePresenter'
import SessionScheduleAttendanceView from './sessionAttendance/sessionScheduleAttendanceView'
import SessionScheduleCyaPresenter from './sessionCya/SessionScheduleCyaPresenter'
import SessionScheduleCyaView from './sessionCya/sessionScheduleCyaView'

export default class SessionScheduleController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showSessionSchedule(req: Request, res: Response): Promise<void> {
    const { groupId, moduleId } = req.params
    const { username } = req.user
    let formError: FormValidationError | null = null

    const sessionTemplates = await this.accreditedProgrammesManageAndDeliverService.getSessionTemplates(
      username,
      groupId,
      moduleId,
    )
    const sessionAttendanceData = await this.accreditedProgrammesManageAndDeliverService.getGroupSessionsAndAttendance(
      username,
      groupId,
    )
    const currentSessionModule = sessionAttendanceData.modules?.find(
      (module: NonNullable<typeof sessionAttendanceData.modules>[number]) => module.id === moduleId,
    )
    const scheduleButtonText = currentSessionModule?.scheduleButtonText || 'Schedule a session'

    if (req.method === 'POST') {
      const selectedSessionTemplateId = req.body['session-template']

      if (!selectedSessionTemplateId) {
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
        req.session.sessionScheduleData = {
          sessionTemplateId: selectedSessionTemplateId,
          sessionName: sessionTemplates.length > 0 ? sessionTemplates[0].name : 'the session',
          scheduleButtonText,
        }
        return res.redirect(`/group/${groupId}/module/${moduleId}/schedule-group-session-details`)
      }
    }

    const presenter = new SessionScheduleWhichPresenter(
      groupId,
      moduleId,
      sessionTemplates.length > 0 ? sessionTemplates[0].name : 'the session',
      sessionTemplates,
      formError,
      req.session.sessionScheduleData?.sessionTemplateId,
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
          sessionType: data.paramsForUpdate.referralIds.length === 1 ? 'ONE_TO_ONE' : 'GROUP',
        }
        return res.redirect(`/group/${groupId}/module/${moduleId}/session-review-details`)
      }
    }

    const sessionDetails = await this.accreditedProgrammesManageAndDeliverService.getIndividualSessionDetails(
      username,
      groupId,
      moduleId,
    )

    const presenter = new AddSessionDetailsPresenter(
      `/${groupId}/${moduleId}`,
      sessionDetails,
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
      const { sessionName, referralName, sessionType, scheduleButtonText, ...sessionDataForApi } = sessionScheduleData
      sessionDataForApi.startDate = (() => {
        const [day, month, year] = sessionScheduleData.startDate.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      })()
      const response = await this.accreditedProgrammesManageAndDeliverService.createSessionSchedule(
        username,
        groupId,
        sessionDataForApi as SessionScheduleRequest,
      )

      const successMessage = response.successMessage?.text || response.message || 'Session has been added.'

      req.session.sessionScheduleData = {}
      return res.redirect(
        `/group/${groupId}/module/${moduleId}/sessions-and-attendance?successMessage=${encodeURIComponent(successMessage)}`,
      )
    }

    const presenter = new SessionScheduleCyaPresenter(`/${groupId}/${moduleId}`, sessionScheduleData)
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

    const presenter = new SessionScheduleAttendancePresenter(groupId, sessionAttendanceData, successMessage)
    const view = new SessionScheduleAttendanceView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }
}
