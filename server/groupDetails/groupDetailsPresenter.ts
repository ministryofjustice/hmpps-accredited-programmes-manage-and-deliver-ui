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

  get isDateUpdated(): boolean {
    return this.message === 'Group start date updated'
  }

  get sessionsAndAttendanceLink(): string {
    return `/group/${this.group.id}/sessions-and-attendance`
  }

  get isStartDateInThePast(): boolean {
    const currentStartDate = new Date(this.group.startDate)
    const currentStartDateEpoch = Date.UTC(
      currentStartDate.getFullYear(),
      currentStartDate.getMonth(),
      currentStartDate.getDate(),
    )
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
      },
    ]
  }

  getGroupParticipantsSummary(): SummaryListItem[] {
    return [
      {
        key: 'Cohort',
        lines: [this.group.cohort],
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
      },
      {
        key: 'Delivery location',
        lines: [this.group.deliveryLocation],
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
