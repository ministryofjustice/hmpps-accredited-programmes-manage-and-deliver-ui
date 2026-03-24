import SessionNotesPresenter from './sessionNotesPresenter'
import ViewUtils from '../utils/viewUtils'

type notesBodyArgs = Array<{
  html: string
  data?: {
    sessionName: string
    moduleName: string
    lastUpdatedDate: string
    attendance: string
  }
  Notes?: string
}>

export default class SessionNotesView {
  constructor(private readonly presenter: SessionNotesPresenter) {}

  private formatSessionNotesForDisplay(sessionNotes: string): string {
    const formattedSessionNotes = ViewUtils.escape(sessionNotes)
    return formattedSessionNotes.replace(/\r\n|\r|\n/g, '<br/>')
  }

  private get notesBodyArgs(): notesBodyArgs {
    return [
      {
        data: {
          sessionName: this.presenter.text.sessionName,
          moduleName: this.presenter.sessionNotesData.moduleName,
          lastUpdatedDate: this.presenter.sessionNotesData.lastUpdatedDate,
          attendance: this.presenter.attendanceOptionText.attendanceState,
        },
        html: `<h2 class="govuk-heading-m">${this.presenter.text.attendanceSummaryTitle}</h2>`,
      },
      {
        Notes: `<div class="govuk-body">${this.formatSessionNotesForDisplay(this.presenter.sessionNotesData.sessionNotes)}</div>`,
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
      },
    ]
  }
}
