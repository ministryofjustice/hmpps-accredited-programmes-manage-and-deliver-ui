export type GroupServiceNavigationPage = 'allocations' | 'schedule' | 'sessions' | 'details'

export default class GroupServiceNavigationPresenter {
  constructor(
    private readonly groupId: string,
    private readonly moduleId: string | undefined,
    private readonly activePage: GroupServiceNavigationPage,
  ) {}

  getServiceNavigationArgs(): {
    classes: string
    navigation: { href: string; text: string; active: boolean }[]
  } {
    return {
      classes: 'group-details__service-navigation',
      navigation: [
        {
          href: `/groupDetails/${this.groupId}/allocated`,
          text: 'Allocations',
          active: this.activePage === 'allocations',
        },
        {
          href: this.moduleId ? `/${this.groupId}/${this.moduleId}/schedule-session-type` : '#',
          text: 'Schedule',
          active: this.activePage === 'schedule',
        },
        {
          href: `/groupDetails/${this.groupId}/sessions`,
          text: 'Sessions and attendance',
          active: this.activePage === 'sessions',
        },
        {
          href: `/groupDetails/${this.groupId}/details`,
          text: 'Group details',
          active: this.activePage === 'details',
        },
      ],
    }
  }
}
