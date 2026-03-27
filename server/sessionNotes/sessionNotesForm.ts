import { FormValidationError } from '../utils/formValidationError'
import errorMessages from '../utils/errorMessages'

export default class SessionNotesForm {
  validateSessionNotes(notes: string): FormValidationError | null {
    if (notes.length <= 10000) {
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
}
