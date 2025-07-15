import ServiceUserBannerPresenter from '../serviceUserBannerPresenter'

export default class LayoutPresenter {
  readonly serviceUserBannerPresenter: ServiceUserBannerPresenter | null

  constructor(
    readonly serviceUser: { name: { forename: string; surname: string }; dateOfBirth: string; crn: string } | null,
  ) {
    this.serviceUserBannerPresenter = this.serviceUser ? new ServiceUserBannerPresenter(this.serviceUser) : null
  }
}
