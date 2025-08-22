import { SummaryListArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'
import OffenceAnalysisPresenter from './offenceAnalysisPresenter'

export default class OffenceAnalysisView {
  constructor(private readonly presenter: OffenceAnalysisPresenter) {}

  get briefOffenceDetailsSummaryList(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(
        this.presenter.briefOffenceDetailsSummaryList(),
        '2.1 - Brief Offence details',
      ),
    }
  }

  get victimsAndPartnersSummaryList(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(
        this.presenter.victimsAndPartnersSummarylist(),
        'R6.2 - Victims and partners',
      ),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
        briefOffenceDetailsSummary: this.briefOffenceDetailsSummaryList,
        victimsAndPartnersSummary: this.victimsAndPartnersSummaryList,
        assessmentCompletedText: this.presenter.assessmentCompletedText,
      },
    ]
  }
}
