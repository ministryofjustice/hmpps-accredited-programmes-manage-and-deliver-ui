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
        changeLink: '/create-group-code',
        visuallyHiddenText: 'group code',
      },
      {
        key: 'Start date',
        lines: [`${this.createGroupFormData.earliestStartDate}`],
        changeLink: '/group-start-date',
        visuallyHiddenText: 'start date',
      },

      {
        key: 'Days and times',
        lines: GroupDaysTimesUtils.formatStartDaysAndTimes(this.createGroupFormData.createGroupSessionSlot),
        changeLink: '/group-days-and-times',
        visuallyHiddenText: 'days and times',
      },

      {
        key: 'Cohort',
        lines: [`${this.createGroupUtils.getCohortTextFromEnum(this.createGroupFormData.cohort)}`],
        changeLink: '/group-cohort',
        visuallyHiddenText: 'cohort',
      },
      {
        key: 'Gender',
        lines: [`${this.createGroupUtils.getSexTextFromEnum(this.createGroupFormData.sex)}`],
        changeLink: '/group-gender',
        visuallyHiddenText: 'gender',
      },
      {
        key: 'PDU',
        lines: [`${this.createGroupFormData.pduName}`],
        changeLink: '/group-probation-delivery-unit',
        visuallyHiddenText: 'PDU',
      },
      {
        key: 'Delivery location',
        lines: [`${this.createGroupFormData.deliveryLocationName}`],
        changeLink: '/group-delivery-location',
        visuallyHiddenText: 'delivery location',
      },
      {
        key: 'Treatment Manager:',
        lines: [members.treatmentManager?.facilitator ?? 'Not assigned'],
        changeLink: '/group-facilitators',
        visuallyHiddenText: 'treatment manager',
      },
      {
        key: 'Facilitators:',
        lines:
          members.facilitators.length > 0 ? members.facilitators.map(member => member.facilitator) : ['None assigned'],
        changeLink: '/group-facilitators',
        visuallyHiddenText: 'facilitators',
      },
    ]
    if (members.coverFacilitators.length > 0) {
      summaryList.push({
        key: 'Cover facilitators:',
        lines:
          members.coverFacilitators.length > 0
            ? members.coverFacilitators.map(member => member.facilitator)
            : ['None assigned'],
        changeLink: '/group-facilitators',
        visuallyHiddenText: 'cover facilitators',
      })
    }
    return summaryList
  }
}
