import ServiceUserBannerPresenter from './serviceUserBannerPresenter'

export default class ServiceUserBannerView {
  constructor(private readonly presenter: ServiceUserBannerPresenter) {}

  get locals() {
    return { serviceUserBannerPresenter: this.presenter }
  }
}
