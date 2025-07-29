import { ReferralDetails } from '@manage-and-deliver-api'
import ReferralDetailsPresenter from './referralDetailsPresenter'

export default class AvailabilityPresenter extends ReferralDetailsPresenter {
  constructor(
    readonly details: ReferralDetails,
    readonly subNavValue: string,
    readonly id: string,
  ) {
    super(details, subNavValue, id)
  }
}
