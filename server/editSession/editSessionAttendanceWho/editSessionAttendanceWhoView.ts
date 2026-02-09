import EditSessionAttendanceWhoPresenter from './editSessionAttendanceWhoPresenter'
import { RadiosArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'

export default class EditSessionAttendanceWhoView {
  constructor(private readonly presenter: EditSessionAttendanceWhoPresenter) {}

  get radioArgs(): RadiosArgs {
    return {
      name: 'edit-session-attendance-who',
      fieldset: {
        legend: {
          text: 'Edit who should attend the session',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l',
        },
      },
      hint: {
        html: '<h2 class="govuk-heading-m">Who is the session for?</h2><p class="govuk-hint">Select who should attend the session.</p>',
      },
      items: this.presenter.generateAttendeeRadioOptions(),
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields['edit-session-attendance-who'].errorMessage),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'editSession/editSessionAttendanceWho',
      {
        presenter: this.presenter,
        backLinkArgs: this.presenter.backLinkArgs,
        radioArgs: this.radioArgs,
        text: this.presenter.text,
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
      },
    ]
  }
}
