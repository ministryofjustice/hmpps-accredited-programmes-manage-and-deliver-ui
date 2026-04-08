import { Request } from 'express'
import { body, ValidationChain } from 'express-validator'
import errorMessages from '../../utils/errorMessages'
import { FormData } from '../../utils/forms/formData'
import FormUtils from '../../utils/formUtils'

type SessionNotesParams = {
  sessionNotes: string
  isSkipAndAddLater: boolean
}

export default class AttendanceSessionNotesForm {
  constructor(private readonly request: Request) {}

  resolveNotesValue(attendeeNotes?: string, bffNotes?: string): string {
    return attendeeNotes ?? bffNotes ?? ''
  }

  async sessionNotesData(): Promise<FormData<SessionNotesParams>> {
    const isSkipAndAddLater = this.request.body.action === 'skip-and-add-later'
    const sessionNotes = (this.request.body['record-session-attendance-notes'] as string | undefined) || ''

    if (isSkipAndAddLater) {
      return {
        paramsForUpdate: {
          sessionNotes,
          isSkipAndAddLater,
        },
        error: null,
      }
    }

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

    return {
      paramsForUpdate: {
        sessionNotes,
        isSkipAndAddLater,
      },
      error: null,
    }
  }

  private validations(): ValidationChain[] {
    return [
      body('record-session-attendance-notes')
        .custom((value: unknown) => {
          const notes = typeof value === 'string' ? value : ''
          return notes.replace(/\r\n/g, '\n').length <= 10000
        })
        .withMessage(errorMessages.recordAttendance.sessionNotesTooLong),
    ]
  }
}
