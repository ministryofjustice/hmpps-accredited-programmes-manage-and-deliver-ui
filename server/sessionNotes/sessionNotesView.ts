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
}>

export default class SessionNotesView {
  constructor(private readonly presenter: SessionNotesPresenter) {}

  private get notesBodyArgs(): notesBodyArgs {
    return [
      {
        data: {
          sessionName: this.presenter.text.sessionName,
          moduleName: this.presenter.sessionNotesData.moduleName,
          sessionDetailsHref: `/group/${this.presenter.sessionNotesData.groupId}/session/${this.presenter.sessionNotesData.sessionId}/edit-session`,
          lastUpdatedDate: this.presenter.sessionNotesData.lastUpdatedDate,
          attendance: this.presenter.attendanceOptionText.attendanceState,
        },
        html: `<h2 class="govuk-heading-m">${this.presenter.text.attendanceSummaryTitle}</h2>`,
      },
      {
        Notes: this.presenter.sessionNotesData.sessionNotes,
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
        isSaved: this.presenter.sessionNotesData.isSaved,
      },
    ]
  }
}
