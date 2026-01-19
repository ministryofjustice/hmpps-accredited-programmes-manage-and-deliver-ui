import ViewUtils from '../utils/viewUtils'
import UpdateReferralStatusFixedPresenter from './updateReferralStatusToOnProgrammeOrCompletedPresenter'

export default class UpdateReferralStatusFixedView {
  constructor(private readonly presenter: UpdateReferralStatusFixedPresenter) {}

  get backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backLinkUri,
    }
  }

  get addDetailsTextboxOptions() {
    return {
      name: 'more-details',
      id: 'more-details',
      label: {
        text: 'Add details (optional)',
        classes: 'govuk-label--m',
        isPageHeading: false,
      },
      maxlength: '500',
      hint: {
        text: 'You can add more information about this update if you need to.',
      },
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.moreDetailsTextArea.errorMessage),
      value: this.presenter.fields.moreDetailsTextArea.value,
    }
  }

  get showInsetText() {
    return this.presenter.details.currentStatusDescription === 'On programme'
  }

  get insetText() {
    return {
      classes: 'govuk-!-margin-top-0',
      html: `Submitting this will terminate the programme requirement in NDelius.`,
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'updateReferralStatus/updateReferralStatusToOnProgrammeOrCompleted',
      {
        presenter: this.presenter,
        addDetailsTextboxOptions: this.addDetailsTextboxOptions,
        backLinkArgs: this.backLinkArgs,
        cancelLinkUri: this.presenter.cancelUri,
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        text: this.presenter.text,
        showInsetText: this.showInsetText,
        insetText: this.insetText,
      },
    ]
  }
}
