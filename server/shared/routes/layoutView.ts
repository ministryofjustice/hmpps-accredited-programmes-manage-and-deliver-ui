import config from '../../config'
import ServiceUserBannerView from '../serviceUserBannerView'
import LayoutPresenter, { PrimaryNavigationTab } from './layoutPresenter'

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
    return {
      label: 'Primary navigation',
      items: [
        {
          text: 'Home',
          href: '/',
          active: this.presenter.primaryNavigationTab === PrimaryNavigationTab.Home,
        },
        {
          text: 'Case list',
          href: '/region/open-referrals',
          active: this.presenter.primaryNavigationTab === PrimaryNavigationTab.Caselist,
        },
        {
          text: 'Groups',
          href: '/groups/not-started-or-in-progress',
          active: this.presenter.primaryNavigationTab === PrimaryNavigationTab.Groups,
        },
      ],
      regionText: this.userRegion.regionDescription,
    }
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
