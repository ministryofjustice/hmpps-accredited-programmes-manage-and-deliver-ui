import { Request } from 'express'
import { body, ValidationChain } from 'express-validator'
import { SessionAttendance } from '@manage-and-deliver-api'
import { FormData } from '../utils/forms/formData'
import FormUtils from '../utils/formUtils'
import errorMessages from '../utils/errorMessages'

export default class RecordAttendanceForm {
  constructor(
    private readonly request: Request,
    private readonly people: { referralId: string; name: string }[],
  ) {}

  async recordAttendanceData(): Promise<FormData<Partial<SessionAttendance>>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: this.validations(),
    })

    const error = FormUtils.validationErrorFromResult(validationResult)
    if (error) {
      return {
        paramsForUpdate: null,
        error,
      }
    }

    // Convert form fields from 'attendance-{referralId}' to attendees array
    const attendees = Object.entries(this.request.body)
      .filter(([key]) => key.startsWith('attendance-'))
      .map(([key, value]) => ({
        referralId: key.replace('attendance-', ''),
        outcomeCode: value as 'ATTC' | 'AFTC' | 'UAAB',
        sessionNotes: '',
      }))

    return {
      paramsForUpdate: {
        attendees,
      },
      error: null,
    }
  }

  private validations(): ValidationChain[] {
    return this.people.map(person =>
      body(`attendance-${person.referralId}`)
        .notEmpty()
        .withMessage(errorMessages.recordAttendance?.selectAttendanceOutcome(person.name)),
    )
  }
}
