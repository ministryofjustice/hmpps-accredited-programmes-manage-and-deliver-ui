import ViewUtils from '../../utils/viewUtils'
import AttendanceSessionNotesPresenter from './attendanceSessionNotesPresenter'

export default class AttendanceSessionNotesView {
  constructor(private readonly presenter: AttendanceSessionNotesPresenter) {}

  readonly sessionTitle: string

  private backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backLinkUri,
    }
  }

  private homePageLink() {
    return {
      text: 'Go to Accredited Programmes homepage',
      href: `/`,
    }
  }

  private get characterCountArgs() {
    const hintText = this.presenter.text.recordsSessionNotesCharacterCount.hint

    return {
      name: 'record-session-attendance-notes',
      id: 'record-session-attendance-notes',
      maxlength: '10000',
      rows: 12,
      label: {
        text: this.presenter.text.recordsSessionNotesCharacterCount.label,
        classes: 'govuk-label govuk-label--m',
      },
      hint: hintText ? { text: hintText } : undefined,
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.recordSessionAttendanceNotes.errorMessage),
      value: this.presenter.fields.recordSessionAttendanceNotes.attendanceValue,
    }
  }

  private get summaryListArgs() {
    if (!this.presenter.personName || !this.presenter.attendanceOptionText) {
      return null
    }
    return {
      rows: [
        {
          key: { text: 'Attendance' },
          value: { html: this.presenter.attendanceOptionText.attendanceState },
          actions: {
            items: [
              {
                text: 'Change',
                href: this.presenter.backLinkUri,
                visuallyHiddenText: `change ${this.presenter.personName}'s attendance status`,
              },
            ],
          },
        },
      ],
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'attendance/recordAttendanceNotes',
      {
        backLinkArgs: this.backLinkArgs(),
        homePageLink: this.homePageLink(),
        characterCountArgs: this.characterCountArgs,
        summaryListArgs: this.summaryListArgs,
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        text: this.presenter.text,
        value: this.presenter.fields.recordSessionAttendanceNotes.attendanceValue,
      },
    ]
  }
}
