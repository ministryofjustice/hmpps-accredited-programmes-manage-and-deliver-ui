import LifestyleAndAssociatesPresenter from './lifestyleAndAssociatesPresenter'
import { InsetTextArgs, SummaryListArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'

export default class LifestyleAndAssociatesView {
  constructor(private readonly presenter: LifestyleAndAssociatesPresenter) {}

  get assessmentCompletedText(): InsetTextArgs {
    return {
      text: `Assessment completed ${this.presenter.lifestyleAndAssociates.assessmentCompleted}`,
      classes: 'govuk-!-margin-top-0',
    }
  }

  get reoffendingSummaryList(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(this.presenter.reoffendingSummaryList(), '7.2 - Reoffending'),
    }
  }

  get lifestyleIssuesSummaryList(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(
        this.presenter.lifestyleIssuesSummaryList(),
        'Lifestyle issues affecting risk or offending harm',
        { showBorders: true, showTitle: true, hideKey: true },
      ),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
        assessmentCompletedText: this.assessmentCompletedText,
        reoffendingSummaryList: this.reoffendingSummaryList,
        lifestyleIssuesSummaryList: this.lifestyleIssuesSummaryList,
      },
    ]
  }
}
