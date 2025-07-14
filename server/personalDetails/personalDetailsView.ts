import PersonalDetailsPresenter from './personalDetailsPresenter'
import { InsetTextArgs, SummaryListArgs } from '../utils/govukFrontendTypes'
import ViewUtils from '../utils/viewUtils'

export default class PersonalDetailsView {
  constructor(private readonly presenter: PersonalDetailsPresenter) {}

  get summary(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(this.presenter.personalDetailsSummaryList(), 'Personal details'),
    }
  }

  get referralSummary(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgs(
        this.presenter.referralSummaryList(),
        { showBorders: false },
        'govuk-!-margin-bottom-0',
      ),
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
      'personalDetails/personalDetails',
      {
        presenter: this.presenter,
        summary: this.summary,
        referralSummary: this.referralSummary,
        importFromDeliusText: this.importFromDeliusText,
      },
    ]
  }
}
