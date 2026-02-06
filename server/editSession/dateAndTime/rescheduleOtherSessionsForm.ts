import { Request } from 'express'
import { RescheduleSessionRequest } from '@manage-and-deliver-api'
import { body, ValidationChain } from 'express-validator'
import FormUtils from '../../utils/formUtils'
import { FormData } from '../../utils/forms/formData'
import errorMessages from '../../utils/errorMessages'

export default class RescheduleOtherSessionsForm {
  constructor(private readonly request: Request) {}

  async rescheduleSessionDetailsData(): Promise<FormData<Partial<RescheduleSessionRequest>>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: this.createSessionDetailsValidations(),
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
        rescheduleOtherSessions: this.request.body['reschedule-other-sessions'] === 'true',
      },
      error: null,
    }
  }

  private createSessionDetailsValidations(): ValidationChain[] {
    return [
      body('reschedule-other-sessions')
        .notEmpty()
        .withMessage(errorMessages.rescheduleSession.rescheduleOtherSessions.rescheduleOtherSessionsEmpty),
    ]
  }
}
