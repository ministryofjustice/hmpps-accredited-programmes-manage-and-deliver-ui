import { ReferralDetails } from '@manage-and-deliver-api'
import ServiceUserBannerPresenter from '../serviceUserBannerPresenter'

export default class LayoutPresenter {
  readonly serviceUserBannerPresenter: ServiceUserBannerPresenter | null

  constructor(
    readonly referralDetails: ReferralDetails,
    readonly primaryNavigationTab?: PrimaryNavigationTab,
  ) {
    this.serviceUserBannerPresenter = this.referralDetails ? new ServiceUserBannerPresenter(this.referralDetails) : null
  }
}

export enum PrimaryNavigationTab {
  Home = 'home',
  Caselist = 'caselist',
  Groups = 'groups',
}
