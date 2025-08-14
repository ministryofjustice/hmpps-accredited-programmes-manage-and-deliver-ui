import { ReferralDetails } from '@manage-and-deliver-api'
import ReferralLayoutPresenter, { HorizontalNavValues } from '../shared/referral/referralLayoutPresenter'

export default class ProgrammeNeedsIdentifierPresenter extends ReferralLayoutPresenter {
  constructor(
    readonly id: string,
    readonly details: ReferralDetails,
  ) {
    super(HorizontalNavValues.programmeNeedsIdentifierTab, id)
  }
}
