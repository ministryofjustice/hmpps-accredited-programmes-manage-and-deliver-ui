import EditSessionAttendeesPresenter from './editSessionAttendeesPresenter'
import { RadiosArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'

export default class EditSessionAttendeesView {
  constructor(private readonly presenter: EditSessionAttendeesPresenter) {}

  get radioArgs(): RadiosArgs {
    return {
      name: 'edit-session-attendees',
      fieldset: {
        legend: {
          text: 'Who is the session for?',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m',
        },
      },
      hint: {
        text: 'Select who should attend the session.',
      },
      items: this.presenter.generateAttendeeRadioOptions(),
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields['edit-session-attendees'].errorMessage),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'editSession/editSessionAttendees',
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
