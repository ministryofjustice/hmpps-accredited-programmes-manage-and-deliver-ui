import { SummaryListArgs } from '../utils/govukFrontendTypes'
import ViewUtils from '../utils/viewUtils'
import SentenceInformationPresenter from './sentenceInformationPresenter'

export default class SentenceInformationView {
  constructor(private readonly presenter: SentenceInformationPresenter) {}

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
