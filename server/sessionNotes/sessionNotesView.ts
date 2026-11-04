import ViewUtils from '../utils/viewUtils'
import SessionNotesPresenter from './sessionNotesPresenter'

type NotesBodySection = Array<{
  html: string
  data?: {
    sessionName: string
    moduleName: string
    sessionDetailsHref: string
    sessionDate: string
    attendance: string
  }
}>

export default class SessionNotesView {
  constructor(private readonly presenter: SessionNotesPresenter) {}

  private get notesBodyArgs(): NotesBodySection {
    return [
      {
        data: {
          sessionName: this.presenter.text.sessionName,
          moduleName: this.presenter.sessionNotesData.moduleName,
          sessionDetailsHref: this.presenter.sessionDetailsHref,
          sessionDate: this.presenter.sessionNotesData.sessionDate ?? '',
          attendance: this.presenter.attendanceOptionText.attendanceState,
        },
        html: `<h2 class="govuk-heading-m">${this.presenter.text.attendanceSummaryTitle}</h2>`,
      },
    ]
  }

  private get showNoNotesAddedMessage(): boolean {
    const { value } = this.presenter.fields.sessionNotes
    return value.trim().length === 0
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'sessionNotes/sessionNotes',
      {
        backLinkArgs: this.presenter.backLinkArgs,
        pageTitle: this.presenter.pageTitle,
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        isReadOnly: this.presenter.isReadOnly,
        notesBodyArgs: this.notesBodyArgs,
        pageHeaderActionsArgs: this.presenter.pageHeaderActionsArgs,
        showNoNotesAddedMessage: this.showNoNotesAddedMessage,
        sessionNotesText: this.presenter.fields.sessionNotes.value,
        text: this.presenter.text,
        successMessageSummary: this.presenter.successMessageSummary,
      },
    ]
  }
}
