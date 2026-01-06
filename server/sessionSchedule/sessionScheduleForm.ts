import { SessionScheduleRequest } from '@manage-and-deliver-api'
import { Request } from 'express'
import { body, ValidationChain } from 'express-validator'
import errorMessages from '../utils/errorMessages'
import { FormData } from '../utils/forms/formData'
import FormUtils from '../utils/formUtils'

export default class SessionScheduleForm {
  constructor(private readonly request: Request) {}

  async sessionScheduleWhichData(): Promise<FormData<Partial<SessionScheduleRequest & { which: string }>>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: this.sessionScheduleWhichValidations(),
    })

    const error = FormUtils.validationErrorFromResult(validationResult)
    if (error) {
      return {
        paramsForUpdate: null,
        error,
      }
    }
    return {
      paramsForUpdate: {
        which: this.request.body['session-schedule-which'],
      },
      error: null,
    }
  }

  private sessionScheduleWhichValidations(): ValidationChain[] {
    return [body('session-schedule-which').notEmpty().withMessage(errorMessages.sessionSchedule.sessionScheduleWhich)]
  }
}
