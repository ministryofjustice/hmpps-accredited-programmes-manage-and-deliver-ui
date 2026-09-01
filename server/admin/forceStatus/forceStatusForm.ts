import { Request } from 'express'
import { body, ValidationChain } from 'express-validator'
import { CreateReferralStatusHistory } from '@manage-and-deliver-api'
import { FormData } from '../../utils/forms/formData'
import FormUtils from '../../utils/formUtils'
import errorMessages from '../../utils/errorMessages'

export default class ForceStatusForm {
  constructor(private readonly request: Request) {}

  async data(): Promise<FormData<CreateReferralStatusHistory>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: ForceStatusForm.validations,
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
        referralStatusDescriptionId: this.request.body['new-status'],
        additionalDetails: this.request.body['more-details'],
      },
      error: null,
    }
  }

  static get validations(): ValidationChain[] {
    return [
      body('more-details').isLength({ max: 500 }).withMessage(errorMessages.forceStatus.detailsTooLong),
      body('new-status').notEmpty().withMessage(errorMessages.forceStatus.newStatusEmpty),
    ]
  }
}
