import { SummaryListArgs } from '../utils/govukFrontendTypes'
import ViewUtils from '../utils/viewUtils'
import AdditionalInformationPresenter from './additionalInformationPresenter'

export default class AdditionalInformationView {
  constructor(private readonly presenter: AdditionalInformationPresenter) {}

  get summary(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(this.presenter.personalDetailsSummaryList(), 'Personal details'),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/referralDetails',
      {
        presenter: this.presenter,
        summary: this.summary,
      },
    ]
  }
}
