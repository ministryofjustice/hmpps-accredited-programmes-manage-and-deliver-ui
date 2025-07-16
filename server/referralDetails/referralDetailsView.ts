import ReferralDetailsPresenter from './referralDetailsPresenter'
import { InsetTextArgs, SummaryListArgs } from '../utils/govukFrontendTypes'
import ViewUtils from '../utils/viewUtils'

export default class ReferralDetailsView {
  constructor(private readonly presenter: ReferralDetailsPresenter) {}

  get summary(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(this.presenter.personalDetailsSummaryList(), 'Personal details'),
    }
  }

  get referralSummary(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgs(
        this.presenter.referralSummaryList(),
        { showBorders: false },
        'govuk-!-margin-bottom-0',
      ),
    }
  }

  get offenceHistorySummaries(): SummaryListArgs[] {
    const summaries: SummaryListArgs[] = []
    this.presenter.offenceHistorySummaryLists().forEach(summary => {
      summaries.push(ViewUtils.summaryListArgsWithSummaryCard(summary.summary, summary.title))
    })
    return summaries
  }

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
        summary: this.summary,
        referralSummary: this.referralSummary,
        importFromDeliusText: this.importFromDeliusText,
        offenceHistorySummaries: this.offenceHistorySummaries,
      },
    ]
  }
}
