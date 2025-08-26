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

  get relationshipIssuesDetails(): string {
    return this.presenter.relationshipsIssuesDetails()
  }

  get relationshipIssuesDetailsHeading(): string {
    return 'Relationship issues affecting risk of offending or harm'
  }

  get assessmentCompletedText(): InsetTextArgs {
    return {
      text: `Assessment completed ${this.presenter.relationships.assessmentCompleted}`,
      classes: 'govuk-!-margin-top-0',
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
        relationshipIssuesDetails: this.relationshipIssuesDetails,
        relationshipIssuesDetailsHeading: this.relationshipIssuesDetailsHeading,
        domesticViolenceSummaryList: this.domesticViolenceSummaryList,
        assessmentCompletedText: this.assessmentCompletedText,
      },
    ]
  }
}
