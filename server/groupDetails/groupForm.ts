import { Request } from 'express'
import { body, ValidationChain } from 'express-validator'
import FormUtils from '../utils/formUtils'
import errorMessages from '../utils/errorMessages'
import { FormData } from '../utils/forms/formData'

export type AddToGroupFormData = {
  addToGroup: string
}

export default class GroupForm {
  constructor(private readonly request: Request) {}

  async addToGroupData(): Promise<FormData<AddToGroupFormData>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: GroupForm.addToGroupValidations,
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
}
