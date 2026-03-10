import EditSessionAttendeesPresenter from './editSessionAttendeesPresenter'
import { CheckboxesArgs, RadiosArgs } from '../../utils/govukFrontendTypes'
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

  get checkboxArgs(): CheckboxesArgs {
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
      items: this.presenter.generateAttendeeCheckboxOptions(),
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
        checkboxArgs: this.checkboxArgs,
        text: this.presenter.text,
        isGroupSession: this.presenter.isGroupSession,
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
      },
    ]
  }
}
