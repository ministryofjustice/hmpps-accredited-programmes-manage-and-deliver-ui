import { randomUUID } from 'crypto'
import SchedulePresenter from '../../groupOverview/schedule/schedulePresenter'

describe('GroupServiceNavigationPresenter', () => {
  const groupId = randomUUID()

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('getMojSubNavigationArgs', () => {
    it('should return navigation args with allocations active', () => {
      // Used as an example to test the schedule tab, as service navigation presenter is protected.
      const presenter = new SchedulePresenter(groupId, {
        preGroupOneToOneStartDate: '',
        gettingStartedModuleStartDate: '',
        endDate: '',
        sessions: [],
        code: '',
      })

      expect(presenter.getMojSubNavigationArgs()).toEqual({
        items: [
          {
            href: `/group/${groupId}/group-details`,
            text: 'Group details',
            active: false,
          },
          {
            href: `/group/${groupId}/waitlist`,
            text: 'Allocations and waitlist',
            active: false,
          },
          {
            href: `/group/${groupId}/schedule-overview`,
            text: 'Schedule overview',
            active: true,
          },
          {
            href: `/group/${groupId}/sessions-and-attendance`,
            text: 'Sessions and attendance',
            active: false,
          },
        ],
      })
    })
  })
})
