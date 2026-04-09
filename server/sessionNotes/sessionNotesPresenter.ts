import { SessionNotes } from '@manage-and-deliver-api'
import attendanceOptionText from '../utils/attendanceUtils'
import { FormValidationError } from '../utils/formValidationError'
import PresenterUtils from '../utils/presenterUtils'
import { convertToUrlFriendlyKebabCase } from '../utils/utils'
import { MojAlertComponentArgs } from '../interfaces/alertComponentArgs'

export type SessionNotesData = SessionNotes & {
  referralId: string
  isAttendanceHistory: boolean
  source?: string
  isSaved?: boolean
  personOnProbationName?: string
}

export default class SessionNotesPresenter {
  constructor(
    private readonly data: SessionNotesData,
    private readonly validationError: FormValidationError | null = null,
  ) {}

  get text() {
    const personOnProbationName = this.data.pageTitle.split(':')[0].trim()
    const successMessageName = this.data.personOnProbationName?.trim() || personOnProbationName
    const lastUpdatedText =
      this.data.lastUpdatedBy && this.data.lastUpdatedDate
        ? `Last updated by ${this.data.lastUpdatedBy} on ${this.data.lastUpdatedDate}.`
        : 'Last updated details unavailable.'

    return {
      headingText: this.data.pageTitle,
      personOnProbationName,
      successMessage: `Attendance recorded for ${successMessageName}.`,
      lastUpdatedText,
      updateAttendanceAndNotesButtonText: 'Update attendance and notes',
      attendanceSummaryTitle: 'Attendance summary',
      sessionNotesTitle: 'Session notes',
      sessionName: this.data.sessionName,
    }
  }

  get successMessageSummary(): MojAlertComponentArgs | null {
    if (!this.data.isSaved) return null

    return {
      title: '',
      text: this.text.successMessage,
      variant: 'success',
      dismissible: true,
      showTitleAsHeading: true,
    }
  }

  get sessionNotesData(): SessionNotesData {
    return this.data
  }

  get isReadOnly(): boolean {
    return this.data.source === 'edit-session'
  }

  get backLinkArgs() {
    if (this.data.source === 'edit-session') {
      return {
        text: `Back to ${this.data.moduleName}`,
        href: `/group/${this.data.groupId}/session/${this.data.sessionId}/edit-session`,
      }
    }

    return {
      text: this.data.isAttendanceHistory ? 'Back to Attendance history' : 'Back to Sessions and attendance',
      href: this.data.isAttendanceHistory
        ? `/referral/${this.data.referralId}/attendance-history`
        : `/group/${this.data.groupId}/sessions-and-attendance`,
    }
  }

  get attendanceOptionText() {
    return attendanceOptionText(this.data.sessionAttendance, { fallbackStatus: 'notAttended' })
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get fields() {
    return {
      sessionNotes: {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'sessionNotes'),
        value: this.data.sessionNotes ?? '',
      },
    }
  }

  get pageUrl(): string {
    const sessionSlug = convertToUrlFriendlyKebabCase(this.data.sessionName)
    return `/group/${this.data.groupId}/session/${this.data.sessionId}/${sessionSlug}/session-notes`
  }

  get recordAttendanceUrl(): string {
    return `/group/${this.data.groupId}/session/${this.data.sessionId}/record-attendance`
  }

  get pageHeaderActionsArgs() {
    return {
      classes: 'govuk-!-margin-bottom-0',
      heading: {
        text: this.text.headingText,
        classes: 'govuk-heading-l',
      },
      items: [
        this.isReadOnly
          ? {
              text: this.text.updateAttendanceAndNotesButtonText,
              classes: 'govuk-button--primary',
              href: this.recordAttendanceUrl,
            }
          : {
              text: this.text.updateAttendanceAndNotesButtonText,
              classes: 'govuk-button--primary',
              element: 'button',
              type: 'submit',
              attributes: {
                form: 'session-notes-form',
              },
            },
      ],
    }
  }

  getNotesRows(notes: string): number {
    const estimatedRows = notes
      .split(/\r\n|\r|\n/)
      .reduce((total, line) => total + Math.max(1, Math.ceil(line.length / 100)), 0)

    return Math.min(Math.max(estimatedRows, 8), 50)
  }
}
