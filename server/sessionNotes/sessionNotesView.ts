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

  private getNotesRows(notes: string): number {
    const estimatedRows = notes
      .split(/\r\n|\r|\n/)
      .reduce((total, line) => total + Math.max(1, Math.ceil(line.length / 100)), 0)

    return Math.min(Math.max(estimatedRows, 8), 50)
  }

  private get notesBodyArgs(): NotesBodySection {
    return [
      {
        data: {
          sessionName: this.presenter.text.sessionName,
          moduleName: this.presenter.sessionNotesData.moduleName,
          sessionDetailsHref: `/group/${this.presenter.sessionNotesData.groupId}/session/${this.presenter.sessionNotesData.sessionId}/edit-session`,
          sessionDate: this.presenter.sessionNotesData.sessionDate ?? '',
          attendance: this.presenter.attendanceOptionText.attendanceState,
        },
        html: `<h2 class="govuk-heading-m">${this.presenter.text.attendanceSummaryTitle}</h2>`,
      },
    ]
  }

  private get textareaArgs() {
    const { value } = this.presenter.fields.sessionNotes

    return {
      id: 'sessionNotes',
      name: 'sessionNotes',
      value,
      rows: this.getNotesRows(value),
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.sessionNotes.errorMessage),
      label: {
        text: this.presenter.text.sessionNotesTitle,
        classes: 'govuk-visually-hidden',
      },
    }
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
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        notesBodyArgs: this.notesBodyArgs,
        showNoNotesAddedMessage: this.showNoNotesAddedMessage,
        textareaArgs: this.textareaArgs,
        text: this.presenter.text,
        successMessageSummary: this.presenter.successMessageSummary,
      },
    ]
  }
}
