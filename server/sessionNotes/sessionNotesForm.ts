import { FormValidationError } from '../utils/formValidationError'
import errorMessages from '../utils/errorMessages'

export default class SessionNotesForm {
  validateSessionNotes(notes: string): FormValidationError | null {
    if (SessionNotesForm.normalisedLength(notes) <= 10000) {
      return null
    }

    return {
      errors: [
        {
          formFields: ['sessionNotes'],
          errorSummaryLinkedField: 'sessionNotes',
          message: errorMessages.recordAttendance.sessionNotesTooLong,
        },
      ],
    }
  }

  private static normalisedLength(notes: string): number {
    return notes.replace(/\r\n/g, '\n').length
  }
}
