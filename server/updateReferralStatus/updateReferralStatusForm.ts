import { Request } from 'express'
import { body, ValidationChain } from 'express-validator'
import { CreateReferralStatusHistory } from '@manage-and-deliver-api'
import { FormData } from '../utils/forms/formData'
import FormUtils from '../utils/formUtils'
import errorMessages from '../utils/errorMessages'

export default class UpdateReferralStatusForm {
  constructor(private readonly request: Request) {}

  async data(): Promise<FormData<CreateReferralStatusHistory>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: UpdateReferralStatusForm.validations,
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
        referralStatusDescriptionId: this.request.body['updated-status'],
        additionalDetails: this.request.body['more-details'],
      },
      error: null,
    }
  }

  static get validations(): ValidationChain[] {
    return [
      body('more-details').isLength({ max: 500 }).withMessage(errorMessages.updateStatus.detailsTooLong),
      body('updated-status').notEmpty().withMessage(errorMessages.updateStatus.updatedStatusEmpty),
    ]
  }
}
