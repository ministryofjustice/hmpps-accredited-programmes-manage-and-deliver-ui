import { PrimaryNavigationTab } from './layoutPresenter'

type PrimaryNavigationItem = {
  text: string
  href: string
  active: boolean
}

export type PrimaryNavigationArgs = {
  label: string
  items: PrimaryNavigationItem[]
  regionText: string
}

export const buildPrimaryNavigationArgs = (
  regionText = '',
  activeTab?: PrimaryNavigationTab,
): PrimaryNavigationArgs => ({
  label: 'Primary navigation',
  items: [
    {
      text: 'Home',
      href: '/',
      active: activeTab === PrimaryNavigationTab.Home,
    },
    {
      text: 'Case list',
      href: '/region/open-referrals',
      active: activeTab === PrimaryNavigationTab.Caselist,
    },
    {
      text: 'Groups',
      href: '/groups/not-started-and-in-progress',
      active: activeTab === PrimaryNavigationTab.Groups,
    },
  ],
  regionText,
})
