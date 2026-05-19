import { ReferralDetails } from '@manage-and-deliver-api'
import LayoutPresenter, { PrimaryNavigationTab } from './layoutPresenter'
import referralDetailsFactory from '../../testutils/factories/referralDetailsFactory'

describe('LayoutPresenter', () => {
  it('creates a serviceUserBannerPresenter when referralDetails is provided', () => {
    const referralDetails = referralDetailsFactory.build()
    const presenter = new LayoutPresenter(referralDetails)

    expect(presenter.serviceUserBannerPresenter).not.toBeNull()
    expect(presenter.referralDetails).toEqual(referralDetails)
  })

  it('sets serviceUserBannerPresenter to null when referralDetails is not provided', () => {
    const presenter = new LayoutPresenter(null as unknown as ReferralDetails)

    expect(presenter.serviceUserBannerPresenter).toBeNull()
  })

  it('stores the primaryNavigationTab', () => {
    const referralDetails = referralDetailsFactory.build()

    const presenter = new LayoutPresenter(referralDetails, PrimaryNavigationTab.Home)

    expect(presenter.primaryNavigationTab).toEqual(PrimaryNavigationTab.Home)
  })
})
