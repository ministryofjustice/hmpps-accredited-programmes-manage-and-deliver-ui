import { LifestyleAndAssociates } from '@manage-and-deliver-api'
import RisksAndNeedsPresenter from '../risksAndNeedsPresenter'
import { SummaryListItem } from '../../utils/summaryList'

export default class LifestyleAndAssociatesPresenter extends RisksAndNeedsPresenter {
  constructor(
    readonly subNavValue: string,
    readonly referralId: string,
    readonly lifestyleAndAssociates: LifestyleAndAssociates,
  ) {
    super(subNavValue, referralId)
  }

  reoffendingSummaryList(): SummaryListItem[] {
    return [
      {
        key: 'Are there any activities that encourage reoffending',
        lines: [this.lifestyleAndAssociates.regActivitiesEncourageOffending],
      },
    ]
  }

  lifestyleIssuesSummaryList(): SummaryListItem[] {
    return [
      {
        key: '',
        lines: [this.lifestyleAndAssociates.lifestyleIssuesDetails],
      },
    ]
  }
}
