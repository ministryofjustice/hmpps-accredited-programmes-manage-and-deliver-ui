import HealthPresenter from './healthPresenter'
import { InsetTextArgs, SummaryListArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'

export default class HealthView {
  constructor(private readonly presenter: HealthPresenter) {}

  get assessmentCompletedText(): InsetTextArgs {
    return {
      text: `Assessment completed ${this.presenter.health.assessmentCompleted}`,
      classes: 'govuk-!-margin-top-0',
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
        infoSummaryList: this.infoSummaryList,
        assessmentCompletedText: this.assessmentCompletedText,
      },
    ]
  }

  get infoSummaryList(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(this.presenter.healthSummaryList(), '13.1 - Health'),
    }
  }
}
