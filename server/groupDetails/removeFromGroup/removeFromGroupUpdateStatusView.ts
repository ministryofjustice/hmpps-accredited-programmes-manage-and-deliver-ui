import RemoveFromGroupUpdateStatusPresenter from './removeFromGroupUpdateStatusPresenter'
import ViewUtils from '../../utils/viewUtils'
import { RadiosArgs } from '../../utils/govukFrontendTypes'

export default class RemoveFromGroupUpdateStatusView {
  constructor(private readonly presenter: RemoveFromGroupUpdateStatusPresenter) {}

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

  get currentStatusTagOptions() {
    return {
      text: this.presenter.statusDetails.currentStatus.title,
      classes: `govuk-tag--${this.presenter.statusDetails.currentStatus.tagColour} max-width-none`,
    }
  }

  get backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backLinkUri,
    }
  }

  get statusUpdateRadioButtonsOptions(): RadiosArgs {
    return {
      name: 'updated-status',
      fieldset: {
        legend: {
          text: 'Select the new referral status',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m',
        },
      },
      hint: {
        text: "These details will be show in the person's status history and the status will also be updated in NDelius.",
      },
      items: this.presenter.generateStatusUpdateRadios(),
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.updatedStatus.errorMessage),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'groupDetails/removeFromGroup/removeFromGroupUpdateStatus',
      {
        presenter: this.presenter,
        statusUpdateRadioButtons: this.statusUpdateRadioButtonsOptions,
        addDetailsTextboxOptions: this.presenter.generateMoreDetailsTextBox(),
        currentStatusTagOptions: this.currentStatusTagOptions,
        getCurrentStatusTimelineOptions: this.getCurrentStatusTimelineOptions.bind(this),
        backLinkArgs: this.backLinkArgs,
        backLinkUri: this.presenter.backLinkUri,
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        text: this.presenter.text,
      },
    ]
  }
}
