import LayoutPresenter, { PrimaryNavigationTab } from './layoutPresenter'

describe('PrimaryNavigationTab', () => {
  it('has correct text values', () => {
    expect(PrimaryNavigationTab.Home).toEqual('home')
    expect(PrimaryNavigationTab.Caselist).toEqual('caselist')
    expect(PrimaryNavigationTab.Groups).toEqual('groups')
  })
})
