import { ReferralDetails } from '@manage-and-deliver-api'
import ServiceUserBannerPresenter from '../serviceUserBannerPresenter'

export default class LayoutPresenter {
  readonly serviceUserBannerPresenter: ServiceUserBannerPresenter | null

  constructor(readonly referralDetails: ReferralDetails) {
    this.serviceUserBannerPresenter = this.referralDetails ? new ServiceUserBannerPresenter(this.referralDetails) : null
  }
}
