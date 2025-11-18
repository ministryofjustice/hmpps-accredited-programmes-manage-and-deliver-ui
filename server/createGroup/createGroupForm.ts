import { CreateGroupRequest } from '@manage-and-deliver-api'
import { Request } from 'express'
import { ValidationChain, body } from 'express-validator'
import errorMessages from '../utils/errorMessages'
import { FormData } from '../utils/forms/formData'
import FormUtils from '../utils/formUtils'

export default class CreateGroupForm {
  constructor(
    private readonly request: Request,
    private readonly existingGroupCode?: string,
  ) {}

  async createGroupCodeData(): Promise<FormData<Partial<CreateGroupRequest>>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: this.createGroupCodeValidations(),
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
        groupCode: this.request.body['create-group-code'],
      },
      error: null,
    }
  }

  async createGroupCohortData(): Promise<FormData<Partial<CreateGroupRequest>>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: this.createGroupCohortValidations(),
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
        cohort: this.request.body['create-group-cohort'],
      },
      error: null,
    }
  }

  async createGroupSexData(): Promise<FormData<Partial<CreateGroupRequest>>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: this.createGroupSexValidations(),
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
        sex: this.request.body['create-group-sex'],
      },
      error: null,
    }
  }

  private createGroupCodeValidations(): ValidationChain[] {
    const validations = [
      body('create-group-code').notEmpty().withMessage(errorMessages.createGroup.createGroupCodeEmpty),
    ]

    if (this.existingGroupCode) {
      validations.push(
        body('create-group-code')
          .not()
          .equals(this.existingGroupCode)
          .withMessage(errorMessages.createGroup.createGroupCodeExists(this.existingGroupCode)),
      )
    }

    return validations
  }

  private createGroupCohortValidations(): ValidationChain[] {
    return [body('create-group-cohort').notEmpty().withMessage(errorMessages.createGroup.createGroupCohortSelect)]
  }

  private createGroupSexValidations(): ValidationChain[] {
    return [body('create-group-sex').notEmpty().withMessage(errorMessages.createGroup.createGroupSexSelect)]
  }
}
