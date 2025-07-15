import LayoutPresenter from './layoutPresenter'
import ServiceUserBannerView from '../serviceUserBannerView'

export interface PageContentView {
  renderArgs: [string, Record<string, unknown>]
}

export default class LayoutView {
  private readonly serviceUserBannerView: ServiceUserBannerView | null

  constructor(
    private readonly presenter: LayoutPresenter,
    private readonly content: PageContentView,
  ) {
    this.serviceUserBannerView = this.presenter.serviceUserBannerPresenter
      ? new ServiceUserBannerView(this.presenter.serviceUserBannerPresenter)
      : null
  }

  // get renderArgs(): [string, Record<string, unknown>] {
  //   return this.content.renderArgs
  // }

  get renderArgs(): [string, Record<string, unknown>] {
    console.log(this.serviceUserBannerView)
    return [
      this.content.renderArgs[0],
      {
        ...this.content.renderArgs[1],
        ...(this.serviceUserBannerView?.locals ?? {}),
      },
    ]
  }
}
