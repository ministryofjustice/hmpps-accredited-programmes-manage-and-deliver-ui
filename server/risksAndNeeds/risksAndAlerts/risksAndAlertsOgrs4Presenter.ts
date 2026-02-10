import { ReferralDetails, Risks } from '@manage-and-deliver-api'
import RisksAndNeedsPresenter from '../risksAndNeedsPresenter'

export default class RisksAndAlertsOgrs4Presenter extends RisksAndNeedsPresenter {
  constructor(
    readonly subNavValue: string,
    readonly referral: ReferralDetails,
    readonly risks: Risks,
    readonly isLdcUpdated: boolean | null = null,
    readonly isCohortUpdated: boolean | null = null,
  ) {
    super(subNavValue, referral, isLdcUpdated, isCohortUpdated)
  }

  levelOrUnknown(level?: string): string {
    return level ? level.toUpperCase() : 'UNKNOWN'
  }
}
