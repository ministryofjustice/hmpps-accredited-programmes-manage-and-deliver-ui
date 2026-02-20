import { Request } from 'express'
import { body, ValidationChain } from 'express-validator'
import { SessionAttendance } from '@manage-and-deliver-api'
import { FormData } from '../utils/forms/formData'
import FormUtils from '../utils/formUtils'
import errorMessages from '../utils/errorMessages'

export default class RecordAttendanceForm {
  constructor(private readonly request: Request) {}

  async recordAttendanceData(): Promise<FormData<Partial<SessionAttendance>>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: RecordAttendanceForm.validations(),
    })

    const error = FormUtils.validationErrorFromResult(validationResult)
    if (error) {
      return {
        paramsForUpdate: null,
        error,
      }
    }

    // Convert form fields like 'attendance-{referralId}' to attendees array
    const attendees = Object.entries(this.request.body)
      .filter(([key]) => key.startsWith('attendance-'))
      .map(([key, value]) => ({
        referralId: key.replace('attendance-', ''),
        outcomeCode: value as string,
      }))

    return {
      paramsForUpdate: {
        attendees,
      },
      error: null,
    }
  }

  static validations(): ValidationChain[] {
    return [body('delete-session').notEmpty().withMessage(errorMessages.editSession.selectDeleteSession)]
  }
}
