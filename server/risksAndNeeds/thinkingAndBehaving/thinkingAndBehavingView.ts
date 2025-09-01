import ThinkingAndBehavingPresenter from './thinkingAndBehavingPresenter'
import { InsetTextArgs, SummaryListArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'

export default class ThinkingAndBehavingView {
  constructor(private readonly presenter: ThinkingAndBehavingPresenter) {}

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
      ...ViewUtils.summaryListArgsWithSummaryCard(
        this.presenter.getThinkingAndBehavingSummaryList(),
        '11 - Thinking and behaving',
      ),
    }
  }

  get assessmentCompletedText(): InsetTextArgs {
    return {
      text: `Assessment completed ${this.presenter.thinkingAndBehaviour.assessmentCompleted}`,
      classes: 'govuk-!-margin-top-0',
    }
  }
}
