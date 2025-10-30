import { ReferralDetails } from '@manage-and-deliver-api'
import GroupAllocationNotesPresenter from '../groupAllocationNotesPresenter'

export default class MotivationBackgroundAndNonAssociationsPresenter extends GroupAllocationNotesPresenter {
  constructor(
    readonly referral: ReferralDetails,
    readonly subNavValue: string,
    readonly isLdcUpdated: boolean | null = null,
    readonly isCohortUpdated: boolean | null = null,
  ) {
    super(referral, subNavValue, isLdcUpdated, isCohortUpdated)
  }

  get text() {
    return {
      noMotivationText: `No motivation, background and non-associations added for ${this.referral.personName}`,
    }
  }
}
