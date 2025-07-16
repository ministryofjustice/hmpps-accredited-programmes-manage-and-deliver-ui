import { SummaryListArgs } from '../utils/govukFrontendTypes'
import ViewUtils from '../utils/viewUtils'
import ProgrammeHistoryPresenter from './programmeHistoryPresenter'

export default class ProgrammeHistoryView {
  constructor(private readonly presenter: ProgrammeHistoryPresenter) {}

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
