import { CreateGroupRequest, CreateGroupTeamMember } from '@manage-and-deliver-api'
import { SummaryListItem } from '../../utils/summaryList'
import CreateGroupUtils from '../createGroupUtils'
import GroupDaysTimesUtils from '../../utils/groupDaysTimesUtils'

export default class CreateGroupCyaPresenter {
  constructor(private readonly createGroupFormData: Partial<CreateGroupRequest>) {}

  createGroupUtils = new CreateGroupUtils()

  get text() {
    return { headingHintText: `Create group ${this.createGroupFormData.groupCode}` }
  }

  get backLinkUri() {
    return `/group-facilitators`
  }

  get pageTitle(): string {
    return 'Review your group details'
  }

  private formatCyaDate(): string {
    const input = this.createGroupFormData.earliestStartDate
    if (!input) {
      return ''
    }

    if (!input.includes('/')) {
      return input
    }

    const [day, month, year] = input.split('/').map(Number)
    const date = new Date(Date.UTC(year, month - 1, day))

    return date
      .toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      })
      .replace(',', '')
  }

  private changeLinkUri(path: string): string {
    const separator = path.includes('?') ? '&' : '?'
    return `${path}${separator}referrer=group-review-details`
  }

  generateSelectedUsers(): {
    treatmentManager: CreateGroupTeamMember | undefined
    facilitators: CreateGroupTeamMember[] | []
    coverFacilitators: CreateGroupTeamMember[] | []
  } {
    if (!this.createGroupFormData.teamMembers || this.createGroupFormData.teamMembers.length === 0) {
      return {
        treatmentManager: undefined,
        facilitators: [],
        coverFacilitators: [],
      }
    }

    return {
      treatmentManager: this.createGroupFormData.teamMembers.find(
        member => member.teamMemberType === 'TREATMENT_MANAGER',
      ),
      facilitators: this.createGroupFormData.teamMembers.filter(
        member => member.teamMemberType === 'REGULAR_FACILITATOR',
      ),
      coverFacilitators: this.createGroupFormData.teamMembers.filter(
        member => member.teamMemberType === 'COVER_FACILITATOR',
      ),
    }
  }

  getCreateGroupSummary(): SummaryListItem[] {
    const members = this.generateSelectedUsers()
    const summaryList = [
      {
        key: 'Group code',
        lines: [`${this.createGroupFormData.groupCode}`],
        changeLink: this.changeLinkUri('/create-group-code'),
        visuallyHiddenText: 'group code',
      },
      {
        key: 'Start date',
        lines: [this.formatCyaDate()],
        changeLink: this.changeLinkUri('/group-start-date'),
        visuallyHiddenText: 'start date',
      },

      {
        key: 'Days and times',
        lines: GroupDaysTimesUtils.formatStartDaysAndTimes(this.createGroupFormData.createGroupSessionSlot),
        changeLink: this.changeLinkUri('/group-days-and-times'),
        visuallyHiddenText: 'days and times',
      },

      {
        key: 'Cohort',
        lines: [`${this.createGroupUtils.getCohortTextFromEnum(this.createGroupFormData.cohort)}`],
        changeLink: this.changeLinkUri('/group-cohort'),
        visuallyHiddenText: 'cohort',
      },
      {
        key: 'Gender',
        lines: [`${this.createGroupUtils.getSexTextFromEnum(this.createGroupFormData.sex)}`],
        changeLink: this.changeLinkUri('/group-gender'),
        visuallyHiddenText: 'gender',
      },
      {
        key: 'PDU',
        lines: [`${this.createGroupFormData.pduName}`],
        changeLink: this.changeLinkUri('/group-probation-delivery-unit'),
        visuallyHiddenText: 'PDU',
      },
      {
        key: 'Delivery location',
        lines: [`${this.createGroupFormData.deliveryLocationName}`],
        changeLink: this.changeLinkUri('/group-delivery-location'),
        visuallyHiddenText: 'delivery location',
      },
      {
        key: 'Treatment Manager',
        lines: [members.treatmentManager?.facilitator ?? 'Not assigned'],
        changeLink: this.changeLinkUri('/group-facilitators'),
        visuallyHiddenText: 'treatment manager',
      },
      {
        key: 'Facilitators',
        lines:
          members.facilitators.length > 0 ? members.facilitators.map(member => member.facilitator) : ['None assigned'],
        changeLink: this.changeLinkUri('/group-facilitators'),
        visuallyHiddenText: 'facilitators',
      },
    ]
    if (members.coverFacilitators.length > 0) {
      summaryList.push({
        key: 'Cover facilitators',
        lines:
          members.coverFacilitators.length > 0
            ? members.coverFacilitators.map(member => member.facilitator)
            : ['None assigned'],
        changeLink: this.changeLinkUri('/group-facilitators'),
        visuallyHiddenText: 'cover facilitators',
      })
    }
    return summaryList
  }
}
