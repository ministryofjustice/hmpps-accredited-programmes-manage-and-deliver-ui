import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import { FormValidationError } from '../utils/formValidationError'

import SessionScheduleWhichPresenter from './sessionWhich/sessionScheduleWhichPresenter'
import SessionScheduleWhichView from './sessionWhich/sessionScheduleWhichView'
import AddSessionDetailsPresenter from './sessionDetails/addSessionDetailsPresenter'
import AddSessionDetailsView from './sessionDetails/addSessionDetailsView'
import SessionScheduleAttendancePresenter from './sessionAttendance/sessionScheduleAttendancePresenter'
import SessionScheduleAttendanceView from './sessionAttendance/sessionScheduleAttendanceView'
import CreateSessionScheduleForm from './sessionScheduleForm'

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

    if (req.method === 'POST') {
      const selectedTemplateId = req.body['session-template']

      if (!selectedTemplateId) {
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
          sessionScheduleTemplateId: selectedTemplateId,
        }
        return res.redirect(`/${groupId}/${moduleId}/schedule-group-session-details`)
      }
    }

    const presenter = new SessionScheduleWhichPresenter(
      groupId,
      moduleId,
      sessionTemplates.length > 0 ? sessionTemplates[0].name : 'the session',
      sessionTemplates,
      formError,
      req.session.sessionScheduleData?.sessionScheduleTemplateId,
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
        }
        return res.redirect(`/${groupId}/${moduleId}/session-review-details`)
      }
    }

    const sessionDetails = await this.accreditedProgrammesManageAndDeliverService.getIndividualSessionDetails(
      username,
      groupId,
      moduleId,
    )

    const presenter = new AddSessionDetailsPresenter(
      `/${groupId}/${moduleId}/schedule-session-type`,
      sessionDetails,
      formError,
      sessionScheduleData,
      userInputData,
    )
    const view = new AddSessionDetailsView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async showSessionAttendance(req: Request, res: Response): Promise<void> {
    const { groupId } = req.params
    const { username } = req.user
    const sessionType = (req.query.sessionType as 'getting-started' | 'one-to-one') || 'getting-started'

    const groupSessionsData = await this.accreditedProgrammesManageAndDeliverService.getGroupSessions(username, groupId)

    const modulesWithTemplates = await Promise.all(
      (groupSessionsData.modules || []).map(async module => {
        const { sessionTemplates } = await this.accreditedProgrammesManageAndDeliverService.getModuleSessionTemplates(
          username,
          groupId,
          module.id,
        )

        return {
          ...module,
          sessionTemplates,
          sessions: module.sessions?.length ? module.sessions : sessionTemplates,
        }
      }),
    )

    const presenter = new SessionScheduleAttendancePresenter(groupId, sessionType, null, null, {
      ...groupSessionsData,
      modules: modulesWithTemplates,
    })
    const view = new SessionScheduleAttendanceView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }
}
