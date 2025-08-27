import drugDetailsPresenter from './drugDetailsPresenter'
import { InsetTextArgs, SummaryListArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'

export default class DrugDetailsView {
  constructor(private readonly presenter: drugDetailsPresenter) {}

  get assessmentCompletedText(): InsetTextArgs {
    return {
      text: `Assessment completed ${this.presenter.drugDetails.assessmentCompleted}`,
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
      ...ViewUtils.summaryListArgsWithSummaryCard(this.presenter.drugDetailsSummaryList(), '8 - Drug misuse'),
    }
  }
}
