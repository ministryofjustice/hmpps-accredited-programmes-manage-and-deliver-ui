import { Request } from 'express'
import { body, ValidationChain } from 'express-validator'
import { FormData } from '../../utils/forms/formData'
import FormUtils from '../../utils/formUtils'
import errorMessages from '../../utils/errorMessages'

export default class ForceStatusLookupForm {
  constructor(private readonly request: Request) {}

  async data(): Promise<FormData<{ referralId: string }>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: ForceStatusLookupForm.validations,
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
        referralId: this.request.body['referral-id'],
      },
      error: null,
    }
  }

  static get validations(): ValidationChain[] {
    return [
      body('referral-id')
        .trim()
        .notEmpty()
        .withMessage(errorMessages.forceStatus.referralIdEmpty)
        .bail()
        .isUUID()
        .withMessage(errorMessages.forceStatus.referralIdInvalid),
    ]
  }
}
