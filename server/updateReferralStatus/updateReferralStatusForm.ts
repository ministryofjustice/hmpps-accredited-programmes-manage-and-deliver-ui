import { Request } from 'express'
import { body, ValidationChain } from 'express-validator'
import { CreateReferralStatusHistory } from '@manage-and-deliver-api'
import { FormData } from '../utils/forms/formData'
import FormUtils from '../utils/formUtils'
import errorMessages from '../utils/errorMessages'

export default class UpdateReferralStatusForm {
  constructor(private readonly request: Request) {}

  async data(currentStatus: string): Promise<FormData<CreateReferralStatusHistory>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: UpdateReferralStatusForm.validations(currentStatus),
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

  static validations(currentStatus: string): ValidationChain[] {
    return [
      body('more-details').isLength({ max: 500 }).withMessage(errorMessages.updateStatus.detailsTooLong),
      body('updated-status')
        .notEmpty()
        .withMessage(
          ['Scheduled', 'On programme'].includes(currentStatus)
            ? errorMessages.updateStatus.updatedStatusEmptyScheduledOnProgramme
            : errorMessages.updateStatus.updatedStatusEmpty,
        ),
    ]
  }

  async interimData(currentStatus: string): Promise<FormData<{ hasStartedOrCompleted: string }>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: UpdateReferralStatusForm.interimValidations(currentStatus),
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
        hasStartedOrCompleted: this.request.body['started-or-completed'],
      },
      error: null,
    }
  }

  static interimValidations(currentStatus: string): ValidationChain[] {
    return [
      body('started-or-completed')
        .notEmpty()
        .withMessage(
          currentStatus === 'Scheduled'
            ? errorMessages.updateStatus.startedProgrammeEmpty
            : errorMessages.updateStatus.completedProgrammeEmpty,
        ),
    ]
  }

  async fixedData(): Promise<FormData<Partial<CreateReferralStatusHistory>>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: UpdateReferralStatusForm.fixedValidations,
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
        additionalDetails: this.request.body['more-details'],
      },
      error: null,
    }
  }

  static get fixedValidations(): ValidationChain[] {
    return [body('more-details').isLength({ max: 500 }).withMessage(errorMessages.updateStatus.detailsTooLong)]
  }
}
