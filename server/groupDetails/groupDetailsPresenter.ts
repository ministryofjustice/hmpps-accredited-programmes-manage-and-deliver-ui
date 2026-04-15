import { GroupDetailsResponse } from '@manage-and-deliver-api'
import GroupServiceLayoutPresenter, { GroupServiceNavigationValues } from '../shared/groups/groupServiceLayoutPresenter'
import { SummaryListItem } from '../utils/summaryList'

export default class GroupDetailsPresenter extends GroupServiceLayoutPresenter {
  constructor(
    readonly group: GroupDetailsResponse,
    readonly message: string | null = null,
  ) {
    super(GroupServiceNavigationValues.groupDetailsTab, group.id)
  }

  get isScheduleUpdated(): boolean {
    return this.message.includes('schedule have been updated')
  }

  get sessionsAndAttendanceLink(): string {
    return `/group/${this.group.id}/sessions-and-attendance`
  }

  private monthNameToNumber(monthName: string): number {
    const months: { [key: string]: number } = {
      january: 0,
      february: 1,
      march: 2,
      april: 3,
      may: 4,
      june: 5,
      july: 6,
      august: 7,
      september: 8,
      october: 9,
      november: 10,
      december: 11,
    }
    return months[monthName] ?? 0
  }

  get isStartDateInThePast(): boolean {
    const parts = this.group.startDate.split(' ')
    const day = parseInt(parts[1], 10)
    const monthName = parts[2]
    const year = parseInt(parts[3], 10)
    const monthNumber = this.monthNameToNumber(monthName.toLowerCase())
    const currentStartDateEpoch = Date.UTC(year, monthNumber, day)
    const currentDate = new Date()
    const currentDateEpoch = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
    return currentStartDateEpoch < currentDateEpoch
  }

  getGroupCodeSummary(): SummaryListItem[] {
    return [
      {
        key: 'Group code',
        lines: [this.group.code],
        changeLink: `/group/${this.groupId}/edit-a-group/edit-group-code`,
        visuallyHiddenText: 'group code',
      },
    ]
  }

  getGroupTimingsSummary(): SummaryListItem[] {
    return [
      {
        key: 'Start date',
        lines: [this.group.startDate],
        changeLink: this.isStartDateInThePast ? null : `/group/${this.groupId}/edit-group-start-date`,
      },
      {
        key: 'Days and times',
        lines: this.group.daysAndTimes,
        changeLink: `/group/${this.groupId}/edit-group-days-and-times`,
      },
    ]
  }

  getGroupParticipantsSummary(): SummaryListItem[] {
    return [
      {
        key: 'Cohort',
        lines: [this.group.cohort],
        changeLink: `/group/${this.groupId}/edit-a-group/edit-group-cohort`,
        visuallyHiddenText: 'group cohort',
      },
      {
        key: 'Sex',
        lines: [this.group.sex],
      },
      {
        key: 'Currently allocated',
        lines:
          this.group.currentlyAllocatedNumber > 0
            ? [
                `${this.group.currentlyAllocatedNumber.toString()} participant${this.group.currentlyAllocatedNumber > 1 ? 's' : ''}`,
              ]
            : ['No people added'],
      },
    ]
  }

  getGroupLocationSummary(): SummaryListItem[] {
    return [
      {
        key: 'Probation delivery unit (PDU)',
        lines: [this.group.pduName],
        changeLink: `/group/${this.groupId}/edit-group-probation-delivery-unit`,
      },
      {
        key: 'Delivery location',
        lines: [this.group.deliveryLocation],
        changeLink: `/group/${this.groupId}/edit-group-delivery-location`,
      },
    ]
  }

  getGroupStaffSummary(): SummaryListItem[] {
    return [
      {
        key: 'Treatment Manager',
        lines: [this.group.treatmentManager],
      },
      {
        key: 'Facilitators',
        lines: this.group.facilitators,
      },
      {
        key: 'Cover facilitators',
        lines: this.group.coverFacilitators.length > 0 ? this.group.coverFacilitators : ['None added'],
      },
    ]
  }

  get text() {
    return {
      headingText: 'Group details',
      pageSubHeading: this.group.code,
    }
  }
}
