import { randomUUID } from 'crypto'
import SchedulePresenter from '../../groupDetails/schedule/schedulePresenter'

describe('GroupServiceNavigationPresenter', () => {
  const groupId = randomUUID()

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('getServiceNavigationArgs', () => {
    it('should return navigation args with allocations active', () => {
      // Used as an example to test the schedule tab, as service navigation presenter is protected.
      const presenter = new SchedulePresenter(groupId, {})

      expect(presenter.getServiceNavigationArgs()).toEqual({
        classes: 'group-details__service-navigation',
        navigation: [
          {
            href: `/groupDetails/${groupId}/waitlist`,
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
  })
})
