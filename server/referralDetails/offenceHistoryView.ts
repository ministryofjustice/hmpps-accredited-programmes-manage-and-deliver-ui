import { InsetTextArgs, SummaryListArgs } from '../utils/govukFrontendTypes'
import ViewUtils from '../utils/viewUtils'
import OffenceHistoryPresenter from './offenceHistoryPresenter'

export default class OffenceHistoryView {
  constructor(private readonly presenter: OffenceHistoryPresenter) {}

  get offenceHistorySummaries(): SummaryListArgs[] {
    const summaries: SummaryListArgs[] = []
    this.presenter.offenceHistorySummaryLists().forEach(summary => {
      summaries.push(ViewUtils.summaryListArgsWithSummaryCard(summary.summary, summary.title))
    })
    return summaries
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/referralDetails',
      {
        presenter: this.presenter,
        offenceHistorySummaries: this.offenceHistorySummaries,
      },
    ]
  }
}
