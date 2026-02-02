import { GroupSchedule } from '@manage-and-deliver-api'
import SchedulePresenter from './schedulePresenter'

describe('SchedulePresenter', () => {
  const groupId = 'group-123'

  const mockGroupSchedule: GroupSchedule = {
    code: 'ABC123',
    preGroupOneToOneStartDate: 'Saturday 31 January 2026',
    gettingStartedModuleStartDate: 'Monday 23 February 2026',
    endDate: 'Monday 14 September 2026',
    sessions: [
      {
        id: '55667ef1-daac-4d46-a685-efaf7b335135',
        name: 'Pre-group',
        type: 'Individual',
        date: 'Monday 2 February 2026',
        time: 'Various times',
      },
      {
        id: 'e1ede808-43c9-46db-bc85-f68632fc6b2b',
        name: 'Introduction to building choices',
        type: 'Group',
        date: 'Monday 23 February 2026',
        time: '2pm',
      },
    ],
  }

  describe('scheduleTableRows', () => {
    it('should convert sessions to table rows', () => {
      const presenter = new SchedulePresenter(groupId, mockGroupSchedule)
      const rows = presenter.scheduleTableRows

      expect(rows).toHaveLength(2)
      expect(rows[0]).toEqual([
        { text: 'Pre-group' },
        { text: 'Individual' },
        { text: 'Monday 2 February 2026', attributes: { 'data-sort-value': 1769990400000 } },
        { text: 'Various times' },
      ])
      expect(rows[1]).toEqual([
        { text: 'Introduction to building choices' },
        { text: 'Group' },
        { text: 'Monday 23 February 2026', attributes: { 'data-sort-value': 1771804800000 } },
        { text: '2pm' },
      ])
    })

    it('should return empty array when no sessions exist', () => {
      const emptySchedule: GroupSchedule = { sessions: [] } as GroupSchedule
      const presenter = new SchedulePresenter(groupId, emptySchedule)

      expect(presenter.scheduleTableRows).toEqual([])
    })
  })
})
