import attendanceOptionText from '../utils/attendanceUtils'
import { convertToUrlFriendlyKebabCase } from '../utils/utils'
import { MojAlertComponentArgs } from '../interfaces/alertComponentArgs'

export interface SessionNotesData {
  pageTitle: string
  moduleName: string
  sessionName: string
  sessionNumber: number
  lastUpdatedBy?: string
  lastUpdatedDate?: string
  groupId: string
  sessionId: string
  sessionDate?: string
  sessionAttendance: string
  sessionNotes?: string
  isAttendanceHistory: boolean
  isSaved?: boolean
  personOnProbationName?: string
}

export default class SessionNotesPresenter {
  constructor(private readonly data: SessionNotesData) {}

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
      successMessage: `Attendance recorded for ${successMessageName}`,
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

  get backLinkArgs() {
    return {
      text: this.data.isAttendanceHistory === false ? 'Back to Attendance history' : `Back to ${this.text.sessionName}`,
      href: this.data.isAttendanceHistory
        ? `/group/${this.data.groupId}/attendance-history`
        : `/group/${this.data.groupId}/sessions-and-attendance`,
    }
  }

  get attendanceOptionText() {
    return attendanceOptionText(this.data.sessionAttendance, { fallbackStatus: 'notAttended' })
  }

  get pageUrl(): string {
    const sessionSlug = convertToUrlFriendlyKebabCase(this.data.sessionName)
    return `/group/${this.data.groupId}/session/${this.data.sessionId}/${sessionSlug}-session-notes`
  }
}
