import { LifestyleAndAssociates, ReferralDetails } from '@manage-and-deliver-api'
import RisksAndNeedsPresenter from '../risksAndNeedsPresenter'
import { SummaryListItem } from '../../utils/summaryList'

export default class LifestyleAndAssociatesPresenter extends RisksAndNeedsPresenter {
  constructor(
    readonly subNavValue: string,
    readonly referral: ReferralDetails,
    readonly lifestyleAndAssociates: LifestyleAndAssociates,
    readonly isLdcUpdated: boolean | null = null,
    readonly isCohortUpdated: boolean | null = null,
  ) {
    super(subNavValue, referral, isLdcUpdated, isCohortUpdated)
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
