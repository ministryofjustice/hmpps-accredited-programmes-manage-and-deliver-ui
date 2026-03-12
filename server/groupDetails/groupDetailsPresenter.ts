import GroupServiceLayoutPresenter, { GroupServiceNavigationValues } from '../shared/groups/groupServiceLayoutPresenter'
import { SummaryListItem } from '../utils/summaryList'

export default class GroupDetailsPresenter extends GroupServiceLayoutPresenter {
  constructor(
    readonly group: {
      id: string
      code: string
      regionName?: string
      earliestStartDate?: string
      startDate?: string
      pduName?: string
      deliveryLocation?: string
      cohort?: string
      sex?: string
      daysAndTimes?: string[]
      currentlyAllocatedNumber?: number
      treatmentManager?: string
      facilitators?: string[]
      coverFacilitators?: string[]
    },
  ) {
    super(GroupServiceNavigationValues.groupDetailsTab, group.id)
  }

  get sessionsAndAttendanceLink(): string {
    return `/group/${this.group.id}/sessions-and-attendance`
  }

  getGroupCodeSummary(): SummaryListItem[] {
    return [
      {
        key: 'Group code',
        lines: [`BCCDD1`],
        changeLink: '/group/create-a-group/create-group-code',
      },
    ]
  }

  getGroupTimingsSummary(): SummaryListItem[] {
    return [
      {
        key: 'Start date',
        lines: [this.group.startDate],
        changeLink: '/group/create-a-group/create-group-code',
      },
      {
        key: 'Days and times',
        lines: this.group.daysAndTimes,
        changeLink: '/group/create-a-group/create-group-code',
      },
    ]
  }

  getGroupParticipantsSummary(): SummaryListItem[] {
    return [
      {
        key: 'Cohort',
        lines: [this.group.cohort],
        changeLink: '/group/create-a-group/create-group-code',
      },
      {
        key: 'Sex',
        lines: [this.group.sex],
        changeLink: '/group/create-a-group/create-group-code',
      },
      {
        key: 'Currently allocated',
        lines:
          this.group.currentlyAllocatedNumber > 0
            ? [
                `${this.group.currentlyAllocatedNumber.toString()} participant${this.group.currentlyAllocatedNumber > 1 ? 's' : ''}`,
              ]
            : ['0 participants'],
      },
    ]
  }

  getGroupLocationSummary(): SummaryListItem[] {
    return [
      {
        key: 'Probation delivery unit (PDU)',
        lines: [this.group.pduName],
        changeLink: '/group/create-a-group/create-group-code',
      },
      {
        key: 'Delivery location',
        lines: [this.group.deliveryLocation],
        changeLink: '/group/create-a-group/create-group-code',
      },
    ]
  }

  getGroupStaffSummary(): SummaryListItem[] {
    return [
      {
        key: 'Treatment Manager',
        lines: [this.group.treatmentManager],
        changeLink: '/group/create-a-group/create-group-code',
      },
      {
        key: 'Facilitators',
        lines: this.group.facilitators,
        changeLink: '/group/create-a-group/create-group-code',
      },
      {
        key: 'Cover facilitators',
        lines: this.group.coverFacilitators.length > 0 ? this.group.coverFacilitators : ['None added'],
        changeLink: '/group/create-a-group/create-group-code',
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
