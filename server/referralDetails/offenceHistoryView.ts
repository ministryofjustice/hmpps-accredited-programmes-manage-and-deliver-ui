import { SummaryListArgs } from '../utils/govukFrontendTypes'
import ViewUtils from '../utils/viewUtils'
import AvailabilityPresenter from './availabilityPresenter'

export default class OffenceHistoryView {
  constructor(private readonly presenter: AvailabilityPresenter) {}

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

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/referralDetails',
      {
        presenter: this.presenter,
        summary: this.summary,
        referralSummary: this.referralSummary,
      },
    ]
  }
}
