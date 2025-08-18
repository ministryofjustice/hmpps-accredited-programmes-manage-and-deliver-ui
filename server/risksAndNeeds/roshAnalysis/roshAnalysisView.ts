import { SummaryListArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'
import RoshAnalysisPresenter from './roshAnalysisPresenter'

export default class RoshAnalysisView {
  constructor(private readonly presenter: RoshAnalysisPresenter) {}

  get summary(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(
        this.presenter.roshAnalsysisSummaryList(),
        'R6.2 - Previous behaviour',
      ),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
        summary: this.summary,
        assessmentCompletedText: this.presenter.assessmentCompletedText,
      },
    ]
  }
}
