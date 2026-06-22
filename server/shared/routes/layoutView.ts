import config from '../../config'
import ServiceUserBannerView from '../serviceUserBannerView'
import LayoutPresenter from './layoutPresenter'
import { buildPrimaryNavigationArgs } from './primaryNavigation'

export interface PageContentView {
  renderArgs: [string, Record<string, unknown>]
}

export interface UserRegion {
  regionCode: string
  regionDescription: string
}

export default class LayoutView {
  private readonly serviceUserBannerView: ServiceUserBannerView | null

  constructor(
    private readonly presenter: LayoutPresenter,
    private readonly content: PageContentView,
    private readonly userRegion?: UserRegion,
  ) {
    this.serviceUserBannerView = this.presenter.serviceUserBannerPresenter
      ? new ServiceUserBannerView(this.presenter.serviceUserBannerPresenter)
      : null
  }

  private get primaryNavigationArgs() {
    return buildPrimaryNavigationArgs(this.userRegion?.regionDescription ?? '', this.presenter.primaryNavigationTab)
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      this.content.renderArgs[0],
      {
        ...this.content.renderArgs[1],
        ...(this.serviceUserBannerView?.locals ?? {}),
        primaryNavigationArgs: this.primaryNavigationArgs,
        authUrl: config.apis.hmppsAuth.url,
      },
    ]
  }
}
