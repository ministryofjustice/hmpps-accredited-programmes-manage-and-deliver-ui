import { SessionScheduleGettingStarted, SessionScheduleOnetoOne } from '@manage-and-deliver-api'
import { Request } from 'express'
import { body, ValidationChain } from 'express-validator'
import errorMessages from '../utils/errorMessages'
import { FormData } from '../utils/forms/formData'
import FormUtils from '../utils/formUtils'

type SessionType = 'getting-started' | 'one-to-one'

export default class SessionScheduleForm {
  constructor(
    private readonly request: Request,
    private readonly existingGroupCode?: string,
  ) {}

  async sessionScheduleData(
    sessionType: SessionType,
  ): Promise<FormData<Partial<SessionScheduleGettingStarted | SessionScheduleOnetoOne>>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: this.sessionScheduleValidations(sessionType),
    })

    const error = FormUtils.validationErrorFromResult(validationResult)
    if (error) {
      return {
        paramsForUpdate: null,
        error,
      }
    }

    const fieldName = sessionType === 'getting-started' ? 'session-getting-started' : 'session-onetoone'

    return {
      paramsForUpdate: {
        sessionScheduleTemplateId: this.request.body[fieldName],
      },
      error: null,
    }
  }

  private sessionScheduleValidations(sessionType: SessionType): ValidationChain[] {
    const fieldName = sessionType === 'getting-started' ? 'session-getting-started' : 'session-onetoone'
    return [body(fieldName).notEmpty().withMessage(errorMessages.sessionSchedule.sessionScheduleWhich)]
  }
}
