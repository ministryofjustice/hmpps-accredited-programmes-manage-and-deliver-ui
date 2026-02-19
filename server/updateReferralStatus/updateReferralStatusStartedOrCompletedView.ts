import ViewUtils from '../utils/viewUtils'
import UpdateReferralStatusStartedOrCompletedPresenter from './updateReferralStatusStartedOrCompletedPresenter'

export default class UpdateReferralStatusStartedOrCompletedView {
  constructor(private readonly presenter: UpdateReferralStatusStartedOrCompletedPresenter) {}

  get backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backLinkUri,
    }
  }

  get statusUpdateRadioButtonsOptions() {
    return {
      name: 'started-or-completed',
      fieldset: {
        legend: {
          text:
            this.presenter.details.currentStatusDescription === 'Scheduled'
              ? `Has ${this.presenter.details.personName} started the programme? `
              : `Has ${this.presenter.details.personName} completed the programme?`,
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--m',
        },
      },
      items: [
        {
          value: 'true',
          text: 'Yes',
          hint: {
            text:
              this.presenter.details.currentStatusDescription === 'On programme'
                ? 'The person has finished the programme and a three-way meeting has taken place.'
                : '',
          },
          checked: this.presenter.fields.currentStatus.value.toLowerCase() === 'true',
        },
        {
          value: 'false',
          text: 'No',
          checked: this.presenter.fields.currentStatus.value.toLowerCase() === 'false',
        },
      ],
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.currentStatus.errorMessage),
    }
  }

  get insetText() {
    return {
      classes: 'govuk-!-margin-top-0',
      html: `${this.presenter.details.personName} is allocated to <a target="_blank" rel="noopener noreferrer" href='/group/${this.presenter.details.currentlyAllocatedGroupId}/allocated'>${this.presenter.details.currentlyAllocatedGroupCode} (opens in a new tab)</a>.`,
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'updateReferralStatus/updateReferralStatusStartedOrCompleted',
      {
        presenter: this.presenter,
        statusUpdateRadioButtons: this.statusUpdateRadioButtonsOptions,
        backLinkArgs: this.backLinkArgs,
        backLinkUri: this.presenter.backLinkUri,
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        text: this.presenter.text,
        insetText: this.insetText,
      },
    ]
  }
}
