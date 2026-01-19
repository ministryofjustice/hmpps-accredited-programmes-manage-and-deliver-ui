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
        text: this.presenter.generateAddDetailsHintText(),
      },
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.moreDetailsTextArea.errorMessage),
      value: this.presenter.fields.moreDetailsTextArea.value,
    }
  }

  get currentStatusTagOptions() {
    return {
      text: this.presenter.statusDetails.currentStatus.title,
      classes: `govuk-tag--${this.presenter.statusDetails.currentStatus.tagColour} max-width-none`,
    }
  }

  get statusUpdateRadioButtonsOptions() {
    return {
      name: 'updated-status',
      fieldset: {
        legend: {
          text: 'Select the new referral status',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m',
        },
      },
      items: this.presenter.generateStatusUpdateRadios(),
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.updatedStatus.errorMessage),
    }
  }

  get topInsetText() {
    return {
      html: `If you want to change this person's status to Scheduled, you must <a href="/groups/started">allocate them to a group.</a>`,
    }
  }

  get bottomInsetText() {
    return {
      html: `Submitting this status change will remove the person from the group.`,
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
        backLinkArgs: this.presenter.backLinkArgs,
        cancelLinkUri: this.presenter.backLinkUri,
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        currentStatus: this.presenter.statusDetails.currentStatus.title,
        topInsetText: this.topInsetText,
        showTopInsetText: this.presenter.showTopInsetText(),
        bottomInsetText: this.bottomInsetText,
        showBottomInsetText: this.presenter.showBottomInsetText(),
      },
    ]
  }
}
