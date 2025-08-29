import RelationshipsPresenter from './relationshipsPresenter'
import { InsetTextArgs, SummaryListArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'

export default class RelationshipsView {
  constructor(private readonly presenter: RelationshipsPresenter) {}

  get domesticViolenceSummaryList(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(this.presenter.relationshipsSummaryList(), '6.7 - Domestic violence'),
    }
  }

  get assessmentCompletedText(): InsetTextArgs {
    return {
      text: `Assessment completed ${this.presenter.relationships.assessmentCompleted}`,
      classes: 'govuk-!-margin-top-0',
    }
  }

  get relationshipIssuesSummaryList(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(
        this.presenter.relationshipsIssuesSummaryList(),
        'Relationship issues affecting risk of offending or harm',
        { showBorders: true, showTitle: true, hideKey: true },
      ),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
        relationshipIssuesSummaryList: this.relationshipIssuesSummaryList,
        domesticViolenceSummaryList: this.domesticViolenceSummaryList,
        assessmentCompletedText: this.assessmentCompletedText,
      },
    ]
  }
}
