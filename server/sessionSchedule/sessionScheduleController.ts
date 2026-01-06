import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import { FormValidationError } from '../utils/formValidationError'

import SessionScheduleWhichPresenter from './which/sessionScheduleWhichPresenter'
import SessionScheduleWhichView from './which/sessionScheduleWhichView'

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
        req.session.sessionScheduleWhichData = {
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
      req.session.sessionScheduleWhichData?.sessionScheduleTemplateId,
    )
    const view = new SessionScheduleWhichView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }
}
