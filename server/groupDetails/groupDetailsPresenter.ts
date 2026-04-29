import { GroupDetailsResponse } from '@manage-and-deliver-api'
import GroupServiceLayoutPresenter, { GroupServiceNavigationValues } from '../shared/groups/groupServiceLayoutPresenter'
import { SummaryListItem } from '../utils/summaryList'
import DateUtils from '../utils/dateUtils'

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

  get isStartDateInThePast(): boolean {
    const parts = this.group.startDate.split(' ')
    const day = parseInt(parts[1], 10)
    const monthName = parts[2]
    const year = parseInt(parts[3], 10)
    const monthNumber = DateUtils.monthNameToNumber(monthName) ?? 0
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
        key: 'Gender',
        lines: [this.group.sex],
        changeLink: `/group/${this.groupId}/edit-group-gender`,
        visuallyHiddenText: 'group gender',
      },
      {
        key: 'Currently allocated',
        lines:
          this.group.currentlyAllocatedNumber > 0
            ? [
                `${this.group.currentlyAllocatedNumber.toString()} participant${this.group.currentlyAllocatedNumber > 1 ? 's' : ''}`,
              ]
            : ['No people allocated'],
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
    const coverFacilitators =
      this.group.coverFacilitators.length > 0 ? this.group.coverFacilitators.map(f => f.facilitator) : ['None added']

    return [
      {
        key: 'Treatment Manager',
        lines: [this.group.treatmentManager?.facilitator || 'None added'],
        changeLink: `/group/${this.groupId}/edit-group-facilitators`,
        visuallyHiddenText: ' edit group treatment manager',
      },
      {
        key: 'Facilitators',
        lines: this.group.facilitators.length > 0 ? this.group.facilitators.map(f => f.facilitator) : ['None added'],
        changeLink: `/group/${this.groupId}/edit-group-facilitators`,
        visuallyHiddenText: 'edit group facilitators',
      },
      {
        key: 'Cover facilitators',
        lines: coverFacilitators.length > 0 ? coverFacilitators : ['None added'],
        changeLink: `/group/${this.groupId}/edit-group-facilitators`,
        visuallyHiddenText: 'edit group cover facilitators',
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
