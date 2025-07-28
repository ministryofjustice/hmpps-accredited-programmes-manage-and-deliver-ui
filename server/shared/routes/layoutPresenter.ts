import { ReferralDetails } from '@manage-and-deliver-api'
import ServiceUserBannerPresenter from '../serviceUserBannerPresenter'

export default class LayoutPresenter {
  readonly serviceUserBannerPresenter: ServiceUserBannerPresenter | null

  constructor(readonly serviceUser: ReferralDetails) {
    this.serviceUserBannerPresenter = this.serviceUser ? new ServiceUserBannerPresenter(this.serviceUser) : null
  }
}
