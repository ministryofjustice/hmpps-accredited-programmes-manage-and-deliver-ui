import { Health, ReferralDetails } from '@manage-and-deliver-api'
import RisksAndNeedsPresenter from '../risksAndNeedsPresenter'
import { SummaryListItem } from '../../utils/summaryList'

export default class HealthPresenter extends RisksAndNeedsPresenter {
  constructor(
    readonly subNavValue: string,
    readonly referral: ReferralDetails,
    readonly health: Health,
    readonly isLdcUpdated: boolean | null = null,
    readonly isCohortUpdated: boolean | null = null,
  ) {
    super(subNavValue, referral, isLdcUpdated, isCohortUpdated)
  }

  healthSummaryList(): SummaryListItem[] {
    const hasHealthCondition = HealthPresenter.yesOrNo(this.health.anyHealthConditions)
    const { description } = this.health

    return [
      {
        key: 'General health - any physical or mental health conditions? (optional)',
        lines: [`${hasHealthCondition}${description ? `\n\n${description}` : ''}`],
      },
    ]
  }

  static yesOrNo(value?: boolean): 'No' | 'Yes' {
    return value ? 'Yes' : 'No'
  }
}
