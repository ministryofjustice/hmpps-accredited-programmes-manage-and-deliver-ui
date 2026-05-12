import { randomUUID } from 'crypto'
import SchedulePresenter from '../../groupOverview/schedule/schedulePresenter'
import GroupDetailsPresenter from '../../groupDetails/groupDetailsPresenter'
import GroupAllocationsPresenter, {
  GroupAllocationsPageSection,
} from '../../groupOverview/allocations/groupAllocationsPresenter'
import SessionScheduleAttendancePresenter from '../../sessionSchedule/sessionAttendance/sessionScheduleAttendancePresenter'
import GroupDetailsFactory from '../../testutils/factories/groupDetailsFactory'
import ProgrammeGroupOverviewFactory from '../../testutils/factories/programmeGroupAllocationsFactory'
import GroupAllocationsFilter from '../../groupOverview/allocations/groupAllocationsFilter'

describe('GroupServiceNavigationPresenter', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('getMojSubNavigationArgs', () => {
    it('should return navigation args with group details active', () => {
      const groupDetails = GroupDetailsFactory.build()
      const presenter = new GroupDetailsPresenter(groupDetails)

      expect(presenter.getMojSubNavigationArgs()).toEqual({
        items: [
          {
            href: `/group/${groupDetails.id}/group-details`,
            text: 'Group details',
            active: true,
          },
          {
            href: `/group/${groupDetails.id}/allocations`,
            text: 'Allocations and waitlist',
            active: false,
          },
          {
            href: `/group/${groupDetails.id}/schedule-overview`,
            text: 'Schedule overview',
            active: false,
          },
          {
            href: `/group/${groupDetails.id}/sessions-and-attendance`,
            text: 'Sessions and attendance',
            active: false,
          },
        ],
      })
    })

    it('should return navigation args with allocations active', () => {
      const groupAllocations = ProgrammeGroupOverviewFactory.build()
      const presenter = new GroupAllocationsPresenter(
        GroupAllocationsPageSection.Allocated,
        groupAllocations,
        groupAllocations.group.id,
        GroupAllocationsFilter.empty(),
      )

      expect(presenter.getMojSubNavigationArgs()).toEqual({
        items: [
          {
            href: `/group/${groupAllocations.group.id}/group-details`,
            text: 'Group details',
            active: false,
          },
          {
            href: `/group/${groupAllocations.group.id}/allocations`,
            text: 'Allocations and waitlist',
            active: true,
          },
          {
            href: `/group/${groupAllocations.group.id}/schedule-overview`,
            text: 'Schedule overview',
            active: false,
          },
          {
            href: `/group/${groupAllocations.group.id}/sessions-and-attendance`,
            text: 'Sessions and attendance',
            active: false,
          },
        ],
      })
    })

    it('should return navigation args with schedule overview active', () => {
      const groupId = randomUUID()
      const presenter = new SchedulePresenter(groupId, {
        preGroupOneToOneStartDate: '',
        gettingStartedModuleStartDate: '',
        endDate: '',
        sessions: [],
        code: 'TEST-001',
      })

      expect(presenter.getMojSubNavigationArgs()).toEqual({
        items: [
          {
            href: `/group/${groupId}/group-details`,
            text: 'Group details',
            active: false,
          },
          {
            href: `/group/${groupId}/allocations`,
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

    it('should return navigation args with sessions and attendance active', () => {
      const testGroupId = randomUUID()
      const presenter = new SessionScheduleAttendancePresenter(testGroupId)

      expect(presenter.getMojSubNavigationArgs()).toEqual({
        items: [
          {
            href: `/group/${testGroupId}/group-details`,
            text: 'Group details',
            active: false,
          },
          {
            href: `/group/${testGroupId}/allocations`,
            text: 'Allocations and waitlist',
            active: false,
          },
          {
            href: `/group/${testGroupId}/schedule-overview`,
            text: 'Schedule overview',
            active: false,
          },
          {
            href: `/group/${testGroupId}/sessions-and-attendance`,
            text: 'Sessions and attendance',
            active: true,
          },
        ],
      })
    })
  })
})
