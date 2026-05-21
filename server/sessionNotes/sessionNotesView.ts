import ViewUtils from '../utils/viewUtils'
import SessionNotesPresenter from './sessionNotesPresenter'
import { convertToUrlFriendlyKebabCase, getEditSessionRouteTitle } from '../utils/utils'

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
    const sessionRouteTitle = this.presenter.sessionNotesData.sessionName.toLowerCase().includes('one-to-one')
      ? getEditSessionRouteTitle(this.presenter.sessionNotesData.sessionName)
      : `${this.presenter.sessionNotesData.moduleName} ${this.presenter.sessionNotesData.sessionNumber}`
    const sessionSlug = convertToUrlFriendlyKebabCase(sessionRouteTitle) || 'session'

    return [
      {
        data: {
          sessionName: this.presenter.text.sessionName,
          moduleName: this.presenter.sessionNotesData.moduleName,
          sessionDetailsHref: `/${this.presenter.sessionNotesData.groupId}/${this.presenter.sessionNotesData.sessionId}/${sessionSlug}`,
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
      rows: this.presenter.getNotesRows(value),
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
        pageTitle: this.presenter.pageTitle,
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        isReadOnly: this.presenter.isReadOnly,
        notesBodyArgs: this.notesBodyArgs,
        pageHeaderActionsArgs: this.presenter.pageHeaderActionsArgs,
        showNoNotesAddedMessage: this.showNoNotesAddedMessage,
        textareaArgs: this.textareaArgs,
        text: this.presenter.text,
        successMessageSummary: this.presenter.successMessageSummary,
      },
    ]
  }
}
