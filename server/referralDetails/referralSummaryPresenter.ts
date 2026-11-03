import { ReferralDetails } from '@manage-and-deliver-api'
import ReferralDetailsPresenter from './referralDetailsPresenter'

export default class ReferralSummaryPresenter extends ReferralDetailsPresenter {
  constructor(
    readonly referralDetails: ReferralDetails,
    readonly subNavValue: string,
    readonly isLdcUpdated: boolean | null = null,
    readonly isCohortUpdated: boolean | null = null,
  ) {
    super(referralDetails, subNavValue, isLdcUpdated, isCohortUpdated)
  }

  get pageTitle(): string {
    return 'Referral summary - Referral details'
  }
}
