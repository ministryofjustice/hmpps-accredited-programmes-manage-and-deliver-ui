import AddAvailabilityPresenter from './addAvailabilityPresenter'
import ViewUtils from '../../utils/viewUtils'

export default class AddAvailabilityView {
  constructor(private readonly presenter: AddAvailabilityPresenter) {}

  private checkboxArgs() {
    return {
      idPrefix: 'availability-checkboxes',
      name: 'availability-checkboxes',
      classes: 'availability-checkboxes',
      fieldset: {
        legend: {
          text: this.presenter.text.checkboxes.pageTitle,
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l',
        },
      },
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.availabilityCheckboxes.errorMessage),
      hint: {
        text: 'Add any availability details you know. You can also add or update this later.',
      },
      items: this.presenter.generateCheckboxItems(),
    }
  }

  private otherDetailsTextAreaArgs() {
    return {
      name: 'other-availability-details-text-area',
      id: 'other-availability-details-text-area',
      maxlength: '2000',
      label: {
        text: this.presenter.text.otherDetailsTextArea.label,
        classes: 'govuk-label--m',
      },
      value: this.presenter.fields.otherDetailsTextArea.value,
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.otherDetailsTextArea.errorMessage),
    }
  }

  private backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backlinkUri,
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/addAvailability/addAvailability',
      {
        presenter: this.presenter,
        checkboxArgs: this.checkboxArgs(),
        otherDetailsTextAreaArgs: this.otherDetailsTextAreaArgs(),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        backLinkArgs: this.backLinkArgs(),
        backlinkUri: this.presenter.backlinkUri,
      },
    ]
  }
}
