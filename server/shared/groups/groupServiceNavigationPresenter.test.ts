import { randomUUID } from 'crypto'
import SchedulePresenter from '../../groupOverview/schedule/schedulePresenter'

describe('GroupServiceNavigationPresenter', () => {
  const groupId = randomUUID()

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('getServiceNavigationArgs', () => {
    it('should return navigation args with allocations active', () => {
      // Used as an example to test the schedule tab, as service navigation presenter is protected.
      const presenter = new SchedulePresenter(groupId, {
        preGroupOneToOneStartDate: '',
        gettingStartedModuleStartDate: '',
        endDate: '',
        sessions: [],
        code: '',
      })

      expect(presenter.getServiceNavigationArgs()).toEqual({
        classes: 'group-details__service-navigation',
        navigation: [
          {
            href: `/groupOverview/${groupId}/waitlist`,
            text: 'Allocations',
            active: false,
          },
          {
            href: `/group/${groupId}/schedule-overview`,
            text: 'Schedule Overview',
            active: true,
          },
          {
            href: `/group/${groupId}/sessions-and-attendance`,
            text: 'Sessions and attendance',
            active: false,
          },
          {
            href: `/group/${groupId}/group-overview`,
            text: 'Group overview',
            active: false,
          },
        ],
      })
    })
  })
})
