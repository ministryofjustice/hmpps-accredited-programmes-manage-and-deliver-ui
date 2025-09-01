import EmotionalWellbeingPresenter from './emotionalWellbeingPresenter'
import { InsetTextArgs, SummaryListArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'

export default class EmotionalWellbeingView {
  constructor(private readonly presenter: EmotionalWellbeingPresenter) {}

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
        this.presenter.getEmotionalWellbeingSummaryList(),
        '10 - Emotional Wellbeing',
      ),
    }
  }

  get assessmentCompletedText(): InsetTextArgs {
    return {
      text: `Assessment completed ${this.presenter.emotionalWellbeing.assessmentCompleted}`,
      classes: 'govuk-!-margin-top-0',
    }
  }
}
