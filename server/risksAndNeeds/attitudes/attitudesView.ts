import AttitudesPresenter from './attitudesPresenter'
import { InsetTextArgs, SummaryListArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'

export default class AttitudesView {
  constructor(private readonly presenter: AttitudesPresenter) {}

  get attitudeSummaryList(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(this.presenter.attitudeSummaryList(), '12 – Attitudes'),
    }
  }

  get assessmentCompletedText(): InsetTextArgs {
    return {
      text: `Assessment completed ${this.presenter.attitude.assessmentCompleted}`,
      classes: 'govuk-!-margin-top-0',
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
        attitudeSummaryList: this.attitudeSummaryList,
        assessmentCompletedText: this.assessmentCompletedText,
      },
    ]
  }
}
