import { InsetTextArgs, SummaryListArgs } from '../utils/govukFrontendTypes'
import ViewUtils from '../utils/viewUtils'
import PersonalDetailsPresenter from './personalDetailsPresenter'

export default class PersonalDetailsView {
  constructor(private readonly presenter: PersonalDetailsPresenter) {}

  get summary(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(this.presenter.personalDetailsSummaryList(), 'Personal details'),
    }
  }

  get importFromDeliusText(): InsetTextArgs {
    return {
      text: 'Imported from NDelius on 1 August 2023, last updated on 4 January 2023',
      classes: 'govuk-!-margin-top-0',
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/referralDetails',
      {
        presenter: this.presenter,
        summary: this.summary,
        importFromDeliusText: this.importFromDeliusText,
      },
    ]
  }
}
