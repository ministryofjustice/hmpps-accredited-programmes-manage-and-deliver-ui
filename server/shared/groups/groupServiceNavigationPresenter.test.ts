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
        label: 'Group service navigation',
        classes: 'group-details__service-navigation',
        items: [
          {
            href: `/group/${groupId}/allocations`,
            text: 'Allocations',
            active: true,
          },
          {
            href: `/group/${groupId}/schedule`,
            text: 'Schedule',
            active: false,
          },
          {
            href: `/group/${groupId}/sessions-and-attendance`,
            text: 'Sessions and attendance',
            active: false,
          },
          {
            href: `/group/${groupId}/group-details`,
            text: 'Group details',
            active: false,
          },
        ],
      })
    })

    it('should return navigation args with schedule active', () => {
      const presenter = new GroupServiceNavigationPresenter(groupId, moduleId, 'schedule')

      expect(presenter.getServiceNavigationArgs()).toEqual({
        label: 'Group service navigation',
        classes: 'group-details__service-navigation',
        items: [
          {
            href: `/group/${groupId}/allocations`,
            text: 'Allocations',
            active: false,
          },
          {
            href: `/group/${groupId}/schedule`,
            text: 'Schedule',
            active: true,
          },
          {
            href: `/group/${groupId}/sessions-and-attendance`,
            text: 'Sessions and attendance',
            active: false,
          },
          {
            href: `/group/${groupId}/group-details`,
            text: 'Group details',
            active: false,
          },
        ],
      })
    })

    it('should return navigation args with sessions active', () => {
      const presenter = new GroupServiceNavigationPresenter(groupId, moduleId, 'sessions')

      expect(presenter.getServiceNavigationArgs()).toEqual({
        label: 'Group service navigation',
        classes: 'group-details__service-navigation',
        items: [
          {
            href: `/group/${groupId}/allocations`,
            text: 'Allocations',
            active: false,
          },
          {
            href: `/group/${groupId}/schedule`,
            text: 'Schedule',
            active: false,
          },
          {
            href: `/group/${groupId}/sessions-and-attendance`,
            text: 'Sessions and attendance',
            active: true,
          },
          {
            href: `/group/${groupId}/group-details`,
            text: 'Group details',
            active: false,
          },
        ],
      })
    })

    it('should return navigation args with details active', () => {
      const presenter = new GroupServiceNavigationPresenter(groupId, moduleId, 'details')

      expect(presenter.getServiceNavigationArgs()).toEqual({
        label: 'Group service navigation',
        classes: 'group-details__service-navigation',
        items: [
          {
            href: `/group/${groupId}/allocations`,
            text: 'Allocations',
            active: false,
          },
          {
            href: `/group/${groupId}/schedule`,
            text: 'Schedule',
            active: false,
          },
          {
            href: `/group/${groupId}/sessions-and-attendance`,
            text: 'Sessions and attendance',
            active: false,
          },
          {
            href: `/group/${groupId}/group-details`,
            text: 'Group details',
            active: true,
          },
        ],
      })
    })

    it('should use placeholder href for schedule when moduleId is undefined', () => {
      const presenter = new GroupServiceNavigationPresenter(groupId, undefined, 'allocations')

      const result = presenter.getServiceNavigationArgs()
      const scheduleItem = result.items.find(item => item.text === 'Schedule')
      expect(scheduleItem?.href).toBe(`/group/${groupId}/schedule`)
    })
  })
})
