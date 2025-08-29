import LearningNeedsPresenter from './learningNeedsPresenter'
import { InsetTextArgs, SummaryListArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'

export default class LearningNeedsView {
  constructor(private readonly presenter: LearningNeedsPresenter) {}

  get assessmentCompletedText(): InsetTextArgs {
    return {
      text: `Assessment completed ${this.presenter.learningNeeds.assessmentCompleted}`,
      classes: 'govuk-!-margin-top-0',
    }
  }

  get infoSummaryList(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(
        this.presenter.learningNeedsSummaryList(),
        'Learning needs information',
      ),
    }
  }

  get scoreSummaryList(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(
        this.presenter.learningNeedsScoreSummaryList(),
        'Learning needs score',
      ),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
        infoSummaryList: this.infoSummaryList,
        scoreSummaryList: this.scoreSummaryList,
        assessmentCompletedText: this.assessmentCompletedText,
      },
    ]
  }
}
