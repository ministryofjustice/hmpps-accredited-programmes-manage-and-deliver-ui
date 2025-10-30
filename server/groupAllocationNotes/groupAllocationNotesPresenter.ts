import { ReferralDetails } from '@manage-and-deliver-api'
import ReferralLayoutPresenter, { HorizontalNavValues } from '../shared/referral/referralLayoutPresenter'

export default class GroupAllocationNotesPresenter extends ReferralLayoutPresenter {
  constructor(
    readonly referral: ReferralDetails,
    readonly isLdcUpdated: boolean | null = null,
    readonly isCohortUpdated: boolean | null = null,
  ) {
    super(HorizontalNavValues.groupAllocationNotesTab, referral, isLdcUpdated, isCohortUpdated)
  }
}
