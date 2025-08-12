import { InsetTextArgs, SummaryListArgs } from '../utils/govukFrontendTypes'
import ViewUtils from '../utils/viewUtils'
import OffenceHistoryPresenter from './offenceHistoryPresenter'
import DateUtils from '../utils/dateUtils'

export default class OffenceHistoryView {
  constructor(private readonly presenter: OffenceHistoryPresenter) {}

  get importFromDeliusText(): InsetTextArgs {
    return {
      text: `Imported from NDelius on ${this.presenter.offenceHistory.importedDate}, last updated on ${DateUtils.formattedDate(new Date())}`,
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
        offenceHistorySummaries: this.offenceHistorySummaries,
        importFromDeliusText: this.importFromDeliusText,
      },
    ]
  }
}
