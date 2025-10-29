import { Request } from 'express'
import { body, ValidationChain } from 'express-validator'
import { FormData } from '../../utils/forms/formData'
import errorMessages from '../../utils/errorMessages'
import FormUtils from '../../utils/formUtils'

export type AddToGroupFormData = {
  addToGroup: string
}

export type AddToGroupMoreDetailsFormData = {
  moreDetails: string
}

export default class AddToGroupForm {
  constructor(private readonly request: Request) {}

  async addToGroupData(): Promise<FormData<AddToGroupFormData>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: AddToGroupForm.addToGroupValidations,
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
        addToGroup: this.request.body['add-to-group'],
      },
      error: null,
    }
  }

  static get addToGroupValidations(): ValidationChain[] {
    return [body('add-to-group').notEmpty().withMessage(errorMessages.addToGroup.addToGroupEmpty)]
  }

  async addToGroupMoreDetailsData(): Promise<FormData<AddToGroupMoreDetailsFormData>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: AddToGroupForm.addToGroupMoreDetailsValidations,
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
        moreDetails: this.request.body['add-details'],
      },
      error: null,
    }
  }

  static get addToGroupMoreDetailsValidations(): ValidationChain[] {
    return [body('add-details').isLength({ max: 500 }).withMessage(errorMessages.addToGroup.exceededCharacterLimit)]
  }
}
