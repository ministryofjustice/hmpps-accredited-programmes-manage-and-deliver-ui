import AddAvailabilityPresenter from './addAvailabilityPresenter'

export default class AddAvailabilityView {
  constructor(private readonly presenter: AddAvailabilityPresenter) {}

  private checkboxArgs() {
    return {
      idPrefix: 'notify-probation-practitioner',
      name: 'notify-probation-practitioner',
      classes: 'availability-checkboxes',
      fieldset: {
        legend: {
          text: this.presenter.text.checkboxes.pageTitle,
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l',
        },
      },
      // errorMessage: ViewUtils.govukErrorMessage(this.inputsPresenter.fields.notifyProbationPractitioner.errorMessage),
      hint: {
        text: 'Add any availability details you know. You can also add or update this later.',
      },
      items: [...this.presenter.checkboxItems],
    }
  }

  private otherDetailsTextAreaArgs() {
    return {
      name: 'other--availability-details-text-area',
      id: 'other--availability-details-text-area',
      maxlength: '2000',
      label: {
        text: this.presenter.text.otherDetailsTextArea.label,
        classes: 'govuk-label--m',
      },
      // value: this.presenter.fields.accessibilityNeeds,
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/addAvailability/addAvailability',
      {
        presenter: this.presenter,
        checkboxArgs: this.checkboxArgs(),
        otherDetailsTextAreaArgs: this.otherDetailsTextAreaArgs(),
      },
    ]
  }
}
