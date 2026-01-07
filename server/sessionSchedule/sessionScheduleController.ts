import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import { FormValidationError } from '../utils/formValidationError'

import SessionScheduleWhichPresenter from './which/sessionScheduleWhichPresenter'
import SessionScheduleWhichView from './which/sessionScheduleWhichView'
import SessionAttendancePresenter from './sessions-and-attendance/sessionAttendancePresenter'
import SessionAttendanceView from './sessions-and-attendance/sessionAttendanceView'

export default class SessionScheduleController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showSessionSchedule(req: Request, res: Response): Promise<void> {
    const { groupId, moduleId } = req.params
    const { username } = req.user
    let formError: FormValidationError | null = null

    const [sessionTemplates, groupDetails] = await Promise.all([
      this.accreditedProgrammesManageAndDeliverService.getSessionTemplates(username, groupId, moduleId),
      this.accreditedProgrammesManageAndDeliverService.getGroupAllocatedMembers(
        username,
        groupId,
        { page: 0, size: 1 },
        {},
      ),
    ])

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
        req.session.sessionScheduleWhichData = {
          sessionScheduleTemplateId: selectedTemplateId,
        }
        return res.redirect(`/${groupId}/${moduleId}/schedule-group-session-details`)
      }
    }

    const presenter = new SessionScheduleWhichPresenter(
      groupId,
      moduleId,
      groupDetails.group.code,
      sessionTemplates,
      formError,
      req.session.sessionScheduleWhichData?.sessionScheduleTemplateId,
    )
    const view = new SessionScheduleWhichView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async showSessionAttendance(req: Request, res: Response): Promise<void> {
    const { groupId, moduleId } = req.params
    const { username } = req.user

    const [sessionAttendanceTemplates, groupDetails] = await Promise.all([
      this.accreditedProgrammesManageAndDeliverService.getSessionAttendanceTemplates(username, groupId, moduleId),
      this.accreditedProgrammesManageAndDeliverService.getGroupAllocatedMembers(
        username,
        groupId,
        { page: 0, size: 1 },
        {},
      ),
    ])

    const presenter = new SessionAttendancePresenter(
      groupId,
      moduleId,
      groupDetails.group.code,
      sessionAttendanceTemplates,
      null,
      undefined,
    )

    const view = new SessionAttendanceView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }
}
