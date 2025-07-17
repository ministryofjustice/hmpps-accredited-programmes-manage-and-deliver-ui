import { Request } from 'express'
import { ValidationChain, body } from 'express-validator'
import FormUtils from '../../utils/formUtils'
import { FormData } from '../../utils/forms/formData'
import errorMessages from '../../utils/errorMessages'

export default class AddAvailabilityForm {
  constructor(private readonly request: Request) {}

  async data(): Promise<FormData<string>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: AddAvailabilityForm.validations,
    })

    const error = FormUtils.validationErrorFromResult(validationResult)
    if (error) {
      return {
        paramsForUpdate: null,
        error,
      }
    }

    return {
      paramsForUpdate: this.request.body['availability-checkboxes'],
      error: null,
    }
  }

  static get validations(): ValidationChain[] {
    return [body('availability-checkboxes').notEmpty().withMessage(errorMessages.addAvailability.empty)]
  }
}
