import { Request } from 'express'
import { body, ValidationChain } from 'express-validator'
import { RemoveFromGroupRequest } from '@manage-and-deliver-api'
import { FormData } from '../../utils/forms/formData'
import errorMessages from '../../utils/errorMessages'
import FormUtils from '../../utils/formUtils'

export type RemoveFromGroupFormData = {
  removeFromGroup: string
}

export default class RemoveFromGroupForm {
  constructor(private readonly request: Request) {}

  async removeFromGroupData(): Promise<FormData<RemoveFromGroupFormData>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: RemoveFromGroupForm.removeFromGroupValidations,
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
        removeFromGroup: this.request.body['remove-from-group'],
      },
      error: null,
    }
  }

  static get removeFromGroupValidations(): ValidationChain[] {
    return [body('remove-from-group').notEmpty().withMessage(errorMessages.removeFromGroup.removeFromGroupEmpty)]
  }

  async removeFromGroupUpdateStatusData(): Promise<FormData<RemoveFromGroupRequest>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: RemoveFromGroupForm.removeFromGroupUpdateStatusValidations,
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
        additionalDetails: this.request.body['additional-details'],
      },
      error: null,
    }
  }

  static get removeFromGroupUpdateStatusValidations(): ValidationChain[] {
    return [
      body('additional-details').isLength({ max: 500 }).withMessage(errorMessages.removeFromGroup.detailsTooLong),
      body('updated-status').notEmpty().withMessage(errorMessages.removeFromGroup.updatedStatusEmpty),
    ]
  }
}
