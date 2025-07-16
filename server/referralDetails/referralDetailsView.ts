import ReferralDetailsPresenter from './referralDetailsPresenter'
import { InsetTextArgs } from '../utils/govukFrontendTypes'

export default class ReferralDetailsView {
  constructor(private readonly presenter: ReferralDetailsPresenter) {}

  get importFromDeliusText(): InsetTextArgs {
    return {
      text: 'Imported from NDelius on 1 August 2023, last updated on 4 January 2023',
      classes: 'govuk-!-margin-top-0',
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/referralDetails',
      {
        presenter: this.presenter,
        importFromDeliusText: this.importFromDeliusText,
      },
    ]
  }
}
