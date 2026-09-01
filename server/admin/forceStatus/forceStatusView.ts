import ViewUtils from '../../utils/viewUtils'
import ForceStatusPresenter from './forceStatusPresenter'

export default class ForceStatusView {
  constructor(private readonly presenter: ForceStatusPresenter) {}

  private get currentStatusTagOptions() {
    const status = this.presenter.formData.currentStatus
    return status
      ? {
          text: status.status,
          classes: `govuk-tag--${status.labelColour ?? 'grey'}`,
        }
      : null
  }

  private get statusRadiosArgs() {
    return {
      name: 'new-status',
      fieldset: {
        legend: {
          text: 'Select the new referral status',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m',
        },
      },
      items: this.presenter.generateStatusRadios(),
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.newStatus.errorMessage),
    }
  }

  private get moreDetailsArgs() {
    return {
      name: 'more-details',
      id: 'more-details',
      label: {
        text: 'Add details (optional)',
        classes: 'govuk-label--m',
      },
      maxlength: '500',
      hint: {
        text: 'Explain why this status is being force-updated, for example to correct drift from nDelius.',
      },
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.moreDetails.errorMessage),
      value: this.presenter.fields.moreDetails.value,
    }
  }

  private get successBanner() {
    return this.presenter.successMessage
      ? {
          titleText: 'Success',
          type: 'success',
          text: this.presenter.successMessage,
        }
      : null
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'admin/forceStatus/forceStatus',
      {
        pageTitle: this.presenter.pageTitle,
        formData: this.presenter.formData,
        currentStatusTagOptions: this.currentStatusTagOptions,
        statusRadiosArgs: this.statusRadiosArgs,
        moreDetailsArgs: this.moreDetailsArgs,
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        successBanner: this.successBanner,
      },
    ]
  }
}
