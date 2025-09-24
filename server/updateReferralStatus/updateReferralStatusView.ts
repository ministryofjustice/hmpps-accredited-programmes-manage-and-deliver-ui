import UpdateReferralStatusPresenter from './updateReferralStatusPresenter'
import ViewUtils from '../utils/viewUtils'

export default class UpdateReferralStatusView {
  constructor(private readonly presenter: UpdateReferralStatusPresenter) {}

  getCurrentStatusTimelineOptions(htmlContent: string) {
    return {
      items: [
        {
          label: {
            text: 'Current status',
          },
          html: htmlContent,
          datetime: {
            timestamp: this.presenter.statusDetails.currentStatus.createdAt,
            type: 'date',
          },
          byline: {
            text: this.presenter.statusDetails.currentStatus.updatedByName,
          },
        },
      ],
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
        text: 'You can add more information about this update, such as the reason for an assessment decision or for deprioritising someone.',
      },
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.moreDetailsTextArea.errorMessage),
      value: this.presenter.fields.moreDetailsTextArea.value,
    }
  }

  get currentStatusTagOptions() {
    return {
      text: this.presenter.statusDetails.currentStatus.title,
      classes: `govuk-tag--${this.presenter.statusDetails.currentStatus.id}`,
    }
  }

  get backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backLinkUri,
    }
  }

  get statusUpdateRadioButtonsOptions() {
    return {
      name: 'updated-status',
      fieldset: {
        legend: {
          text: 'Select the new referral status',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--m',
        },
      },
      items: this.presenter.generateStatusUpdateCheckboxes(),
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.updatedStatus.errorMessage),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'updateReferralStatus/updateReferralStatus',
      {
        presenter: this.presenter,
        statusUpdateRadioButtons: this.statusUpdateRadioButtonsOptions,
        addDetailsTextboxOptions: this.addDetailsTextboxOptions,
        currentStatusTagOptions: this.currentStatusTagOptions,
        getCurrentStatusTimelineOptions: this.getCurrentStatusTimelineOptions.bind(this),
        backLinkArgs: this.backLinkArgs,
        backLinkUri: this.presenter.backLinkUri,
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
      },
    ]
  }
}
