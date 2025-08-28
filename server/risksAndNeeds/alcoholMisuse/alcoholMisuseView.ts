import AlcoholMisusePresenter from './alcoholMisusePresenter'
import { InsetTextArgs, SummaryListArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'

export default class AlcoholMisuseView {
  constructor(private readonly presenter: AlcoholMisusePresenter) {}

  get assessmentCompletedText(): InsetTextArgs {
    return {
      text: `Assessment completed ${this.presenter.alcoholMisuseDetails.assessmentCompleted}`,
      classes: 'govuk-!-margin-top-0',
    }
  }

  get alcoholMisuseSummaryList(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(this.presenter.alcoholMisuseSummaryList(), '9 – Alcohol Misuse'),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
        alcoholMisuseSummaryList: this.alcoholMisuseSummaryList,
        assessmentCompletedText: this.assessmentCompletedText,
      },
    ]
  }
}
