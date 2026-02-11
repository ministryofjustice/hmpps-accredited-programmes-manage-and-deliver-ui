import { Request } from 'express'
import { body, ValidationChain } from 'express-validator'
import { FormData } from '../utils/forms/formData'
import FormUtils from '../utils/formUtils'
import errorMessages from '../utils/errorMessages'

export default class EditSessionForm {
  constructor(private readonly request: Request) {}

  async deleteData(): Promise<FormData<{ delete: string }>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: EditSessionForm.deleteValidations(),
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
        delete: this.request.body['delete-session'],
      },
      error: null,
    }
  }

  static deleteValidations(): ValidationChain[] {
    return [body('delete-session').notEmpty().withMessage(errorMessages.editSession.selectDeleteSession)]
  }

  async attendeesData(): Promise<FormData<{ referralId: string }>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: EditSessionForm.attendeesValidations(),
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
        referralId: this.request.body['edit-session-attendees'],
      },
      error: null,
    }
  }

  static attendeesValidations(): ValidationChain[] {
    return [body('edit-session-attendees').notEmpty().withMessage(errorMessages.editSession.selectAttendees)]
  }
}
