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
import { PrimaryNavigationTab } from '../shared/routes/layoutPresenter'
import BaseController from '../shared/baseController'

export default class SessionScheduleController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Groups

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

  async showSessionSchedule(req: Request, res: Response): Promise<void> {
    const { groupId, moduleId } = req.params
    const { username } = req.user
    const { sessionScheduleData } = req.session
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
        const [selectedSessionTemplateId, selectedSessionTemplateType, sessionName, groupOrOneToOne] =
          selectedSession.split('+')
        req.session.sessionScheduleData = {
          ...sessionScheduleData,
          sessionTemplateId: selectedSessionTemplateId,
          headingText: scheduleSessionTypeResponse.pageHeading,
          sessionScheduleType: selectedSessionTemplateType,
          sessionName,
          selectedSession,
          groupOrOneToOne,
        }
        return res.redirect(`/group/${groupId}/module/${moduleId}/schedule-session-details`)
      }
    }
    const presenter = new SessionScheduleWhichPresenter(
      groupId,
      scheduleSessionTypeResponse,
      formError,
      req.session.sessionScheduleData?.selectedSession,
    )
    const view = new SessionScheduleWhichView(presenter)
    return this.renderPage(res, view)
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
        const whoValue = req.body['session-details-who']
        let referralName = ''

        // Generate the list of referral Names to display on the cya page, from the whoValue which is in format '12345 + Alex River'
        if (Array.isArray(whoValue)) {
          const names = whoValue.map(IdAndName => IdAndName.split('+')[1].trim())
          referralName = names.join(', ')
        } else {
          referralName = whoValue.split('+')[1].trim()
        }

        req.session.sessionScheduleData = {
          ...sessionScheduleData,
          referralIds: data.paramsForUpdate.referralIds,
          facilitators: data.paramsForUpdate.facilitators,
          startDate: data.paramsForUpdate.startDate,
          startTime: data.paramsForUpdate.startTime,
          endTime: data.paramsForUpdate.endTime,
          referralName,
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
    return this.renderPage(res, view)
  }

  async scheduleGroupSessionCya(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { groupId, moduleId } = req.params
    const { sessionScheduleData } = req.session

    if (req.method === 'POST') {
      const { sessionName, referralName, selectedSession, headingText, groupOrOneToOne, ...sessionDataForApi } =
        sessionScheduleData
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
    return this.renderPage(res, view)
  }

  async showSessionAttendance(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { groupId } = req.params
    const { successMessage } = req.query as {
      successMessage?: string
    }

    // Clear session data before starting journeys
    req.session.sessionScheduleData = {}

    const sessionAttendanceData = await this.accreditedProgrammesManageAndDeliverService.getGroupSessionsAndAttendance(
      username,
      groupId,
    )

    const presenter = new SessionScheduleAttendancePresenter(groupId, sessionAttendanceData, successMessage)
    const view = new SessionScheduleAttendanceView(presenter)
    return this.renderPage(res, view)
  }
}
