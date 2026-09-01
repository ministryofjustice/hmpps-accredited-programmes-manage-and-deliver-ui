import { InputArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'
import ForceStatusLookupPresenter from './forceStatusLookupPresenter'

export default class ForceStatusLookupView {
  constructor(private readonly presenter: ForceStatusLookupPresenter) {}

  private get referralIdInputArgs(): InputArgs {
    return {
      id: 'referral-id',
      name: 'referral-id',
      label: {
        text: 'Referral ID',
        classes: 'govuk-label--m',
      },
      hint: {
        text: 'Enter the UUID of the referral whose status you want to force-update.',
      },
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.referralId.errorMessage),
      value: this.presenter.fields.referralId.value,
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'admin/forceStatus/lookupReferral',
      {
        pageTitle: this.presenter.pageTitle,
        referralIdInputArgs: this.referralIdInputArgs,
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
      },
    ]
  }
}
