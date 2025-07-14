import PersonalDetailsPresenter from './personalDetailsPresenter'
import { InsetTextArgs, SummaryListArgs } from '../utils/govukFrontendTypes'
import { SummaryListItem } from '../utils/summaryList'
import ViewUtils from '../utils/viewUtils'

export default class PersonalDetailsView {
  constructor(private readonly presenter: PersonalDetailsPresenter) {}

  // static summary(items: SummaryListItem[]): SummaryListArgs {
  //   return {
  //     ...ViewUtils.summaryListArgs(items),
  //   }
  // }

  get summary(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(this.presenter.referralSummaryList(), 'Personal details'),
    }
  }

  get importFromDeliusText(): InsetTextArgs {
    return {
      text: 'some text',
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'personalDetails/personalDetails',
      {
        presenter: this.presenter,
        summary: this.summary,
        importFromDeliusText: this.importFromDeliusText,
      },
    ]
  }
}
