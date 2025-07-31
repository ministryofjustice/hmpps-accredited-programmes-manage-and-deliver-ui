import SentenceInformationPresenter from './sentenceInformationPresenter'
import { SummaryListArgs } from '../utils/govukFrontendTypes'
import ViewUtils from '../utils/viewUtils'

export default class SentenceInformationView {
  constructor(private readonly presenter: SentenceInformationPresenter) {}

  get sentenceDetailsSummary(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(
        this.presenter.sentenceInformationSummaryList(),
        'Sentence Information',
      ),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/referralDetails',
      {
        presenter: this.presenter,
        sentenceDetailsSummary: this.sentenceDetailsSummary,
      },
    ]
  }
}
