import HealthPresenter from './healthPresenter'
import { SummaryListArgs } from '../utils/govukFrontendTypes'
import ViewUtils from '../utils/viewUtils'
import PersonalDetailsPresenter from './personalDetailsPresenter'

export default class PersonalDetailsView {
  constructor(private readonly presenter: PersonalDetailsPresenter) {}

  get summary(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(this.presenter.personalDetailsSummaryList(), 'Health'),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
        summary: this.summary,
        importFromDeliusText: this.presenter.importFromDeliusText,
      },
    ]
  }
}
