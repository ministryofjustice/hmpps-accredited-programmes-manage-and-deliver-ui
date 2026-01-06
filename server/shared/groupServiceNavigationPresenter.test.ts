import { randomUUID } from 'crypto'
import GroupServiceNavigationPresenter from './groupServiceNavigationPresenter'

describe('GroupServiceNavigationPresenter', () => {
  const groupId = randomUUID()
  const moduleId = randomUUID()

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('getServiceNavigationArgs', () => {
    it('should return navigation args with allocations active', () => {
      const presenter = new GroupServiceNavigationPresenter(groupId, moduleId, 'allocations')

      expect(presenter.getServiceNavigationArgs()).toEqual({
        classes: 'group-details__service-navigation',
        navigation: [
          {
            href: `/groupDetails/${groupId}/allocated`,
            text: 'Allocations',
            active: true,
          },
          {
            href: `/${groupId}/${moduleId}/schedule-session-type`,
            text: 'Schedule',
            active: false,
          },
          {
            href: `/groupDetails/${groupId}/sessions`,
            text: 'Sessions and attendance',
            active: false,
          },
          {
            href: `/groupDetails/${groupId}/details`,
            text: 'Group details',
            active: false,
          },
        ],
      })
    })

    it('should return navigation args with schedule active', () => {
      const presenter = new GroupServiceNavigationPresenter(groupId, moduleId, 'schedule')

      expect(presenter.getServiceNavigationArgs()).toEqual({
        classes: 'group-details__service-navigation',
        navigation: [
          {
            href: `/groupDetails/${groupId}/allocated`,
            text: 'Allocations',
            active: false,
          },
          {
            href: `/${groupId}/${moduleId}/schedule-session-type`,
            text: 'Schedule',
            active: true,
          },
          {
            href: `/groupDetails/${groupId}/sessions`,
            text: 'Sessions and attendance',
            active: false,
          },
          {
            href: `/groupDetails/${groupId}/details`,
            text: 'Group details',
            active: false,
          },
        ],
      })
    })

    it('should return navigation args with sessions active', () => {
      const presenter = new GroupServiceNavigationPresenter(groupId, moduleId, 'sessions')

      expect(presenter.getServiceNavigationArgs()).toEqual({
        classes: 'group-details__service-navigation',
        navigation: [
          {
            href: `/groupDetails/${groupId}/allocated`,
            text: 'Allocations',
            active: false,
          },
          {
            href: `/${groupId}/${moduleId}/schedule-session-type`,
            text: 'Schedule',
            active: false,
          },
          {
            href: `/groupDetails/${groupId}/sessions`,
            text: 'Sessions and attendance',
            active: true,
          },
          {
            href: `/groupDetails/${groupId}/details`,
            text: 'Group details',
            active: false,
          },
        ],
      })
    })

    it('should return navigation args with details active', () => {
      const presenter = new GroupServiceNavigationPresenter(groupId, moduleId, 'details')

      expect(presenter.getServiceNavigationArgs()).toEqual({
        classes: 'group-details__service-navigation',
        navigation: [
          {
            href: `/groupDetails/${groupId}/allocated`,
            text: 'Allocations',
            active: false,
          },
          {
            href: `/${groupId}/${moduleId}/schedule-session-type`,
            text: 'Schedule',
            active: false,
          },
          {
            href: `/groupDetails/${groupId}/sessions`,
            text: 'Sessions and attendance',
            active: false,
          },
          {
            href: `/groupDetails/${groupId}/details`,
            text: 'Group details',
            active: true,
          },
        ],
      })
    })

    it('should use placeholder href for schedule when moduleId is undefined', () => {
      const presenter = new GroupServiceNavigationPresenter(groupId, undefined, 'allocations')

      const result = presenter.getServiceNavigationArgs()
      const scheduleItem = result.navigation.find(item => item.text === 'Schedule')
      expect(scheduleItem?.href).toBe('#')
    })
  })
})
