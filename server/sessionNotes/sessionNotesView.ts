import SessionNotesPresenter from './sessionNotesPresenter'

type notesBodyArgs = Array<{
  html: string
  data?: {
    sessionName: string
    moduleName: string
    sessionDetailsHref: string
    lastUpdatedDate: string
    attendance: string
  }
  Notes?: string
  notesRows?: number
}>

export default class SessionNotesView {
  constructor(private readonly presenter: SessionNotesPresenter) {}

  private getNotesRows(notes: string): number {
    const estimatedRows = notes
      .split(/\r\n|\r|\n/)
      .reduce((total, line) => total + Math.max(1, Math.ceil(line.length / 100)), 0)

    return Math.min(Math.max(estimatedRows, 8), 50)
  }

  private get notesBodyArgs(): notesBodyArgs {
    const sessionNotes = this.presenter.sessionNotesData.sessionNotes ?? ''

    return [
      {
        data: {
          sessionName: this.presenter.text.sessionName,
          moduleName: this.presenter.sessionNotesData.moduleName,
          sessionDetailsHref: `/group/${this.presenter.sessionNotesData.groupId}/session/${this.presenter.sessionNotesData.sessionId}/edit-session`,
          lastUpdatedDate: this.presenter.sessionNotesData.lastUpdatedDate ?? '',
          attendance: this.presenter.attendanceOptionText.attendanceState,
        },
        html: `<h2 class="govuk-heading-m">${this.presenter.text.attendanceSummaryTitle}</h2>`,
      },
      {
        Notes: sessionNotes,
        notesRows: this.getNotesRows(sessionNotes),
        html: `<h2 class="govuk-heading-m">${this.presenter.text.sessionNotesTitle}</h2>`,
      },
    ]
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'sessionNotes/sessionNotes',
      {
        backLinkArgs: this.presenter.backLinkArgs,
        notesBodyArgs: this.notesBodyArgs,
        text: this.presenter.text,
        successMessageSummary: this.presenter.successMessageSummary,
      },
    ]
  }
}
