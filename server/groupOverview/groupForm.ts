import { Request } from 'express'
import { body, ValidationChain } from 'express-validator'
import FormUtils from '../utils/formUtils'
import errorMessages from '../utils/errorMessages'
import { FormData } from '../utils/forms/formData'

export type AddToGroupFormData = {
  addToGroup: string
  personName: string
}

export type RemoveFromGroupFormData = {
  removeFromGroup: string
  personName: string
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
    const [name = '', id = ''] = this.request.body['add-to-group'].split('*')
    return {
      paramsForUpdate: {
        addToGroup: id,
        personName: name,
      },
      error: null,
    }
  }

  static get addToGroupValidations(): ValidationChain[] {
    return [body('add-to-group').notEmpty().withMessage(errorMessages.addToGroup.selectAPerson)]
  }

  async removeFromGroupData(): Promise<FormData<RemoveFromGroupFormData>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: GroupForm.removeFromGroupValidations,
    })

    const error = FormUtils.validationErrorFromResult(validationResult)
    if (error) {
      return {
        paramsForUpdate: null,
        error,
      }
    }
    const [name = '', id = ''] = this.request.body['remove-from-group'].split('*')
    return {
      paramsForUpdate: {
        removeFromGroup: id,
        personName: name,
      },
      error: null,
    }
  }

  static get removeFromGroupValidations(): ValidationChain[] {
    return [body('remove-from-group').notEmpty().withMessage(errorMessages.removeFromGroup.selectAPerson)]
  }
}
