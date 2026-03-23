import { convertToUrlFriendlyKebabCase } from '../utils/utils'

export interface SessionNotesData {
  pageTitle: string
  moduleName: string
  sessionNumber: number
  lastUpdatedBy: string
  lastUpdatedDate: string
  groupId: string
  sessionId: string
  sessionDate: string
  sessionAttendance: string
  sessionNotes: string
  isAttendanceHistory: boolean
}

export default class SessionNotesPresenter {
  constructor(private readonly data: SessionNotesData) {}

  get text() {
    const sessionNameFromTitle = this.data.pageTitle.replace(/^[^:]+:\s*/, '').replace(/\s+session notes$/i, '')

    return {
      headingText: this.data.pageTitle,
      lastUpdatedText: `Last updated by ${this.data.lastUpdatedBy} on ${this.data.lastUpdatedDate}.`,
      updateAttendanceAndNotesButtonText: 'Update attendance and notes',
      attendanceSummaryTitle: 'Attendance summary',
      sessionNotesTitle: 'Session notes',
      sessionName: sessionNameFromTitle,
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

  get pageUrl(): string {
    const constructURL = this.constructURLFromSessionName()

    if (constructURL) {
      return `/group/${this.data.groupId}/session/${this.data.sessionId}/${constructURL}-session-notes`
    }

    const moduleSlug = convertToUrlFriendlyKebabCase(this.data.moduleName)
    return `/group/${this.data.groupId}/session/${this.data.sessionId}/${moduleSlug}-${this.data.sessionNumber}-session-notes`
  }

  private constructURLFromSessionName(): string | null {
    const sessionName = this.text.sessionName.toLowerCase()
    const isVariation = /(catch-?up|one-to-one|post-programme\s+review)/.test(sessionName)

    if (!isVariation) {
      return null
    }

    return convertToUrlFriendlyKebabCase(this.text.sessionName)
  }
}
