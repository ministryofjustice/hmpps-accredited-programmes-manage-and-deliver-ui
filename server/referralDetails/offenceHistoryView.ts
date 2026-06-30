import { InsetTextArgs, SummaryListArgs } from '../utils/govukFrontendTypes'
import ViewUtils from '../utils/viewUtils'
import OffenceHistoryPresenter from './offenceHistoryPresenter'

export default class OffenceHistoryView {
  constructor(private readonly presenter: OffenceHistoryPresenter) {}

  get importFromDeliusText(): InsetTextArgs {
    return {
      text: `Imported from NDelius on ${this.presenter.offenceHistory.importedDate}.`,
      classes: 'govuk-!-margin-top-0',
    }
  }

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
        pageTitle: this.presenter.pageTitle,
        offenceHistorySummaries: this.offenceHistorySummaries,
        importFromDeliusText: this.importFromDeliusText,
      },
    ]
  }
}
