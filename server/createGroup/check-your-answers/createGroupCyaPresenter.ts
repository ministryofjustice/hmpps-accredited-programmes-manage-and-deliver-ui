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
    return `/group/create-a-group/group-facilitators`
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
        key: 'Group Code',
        lines: [`${this.createGroupFormData.groupCode}`],
        changeLink: '/group/create-a-group/create-group-code',
      },
      {
        key: 'Date',
        lines: [`${this.createGroupFormData.earliestStartDate}`],
        changeLink: '/group/create-a-group/group-start-date',
      },

      {
        key: 'Day and time',
        lines: GroupDaysTimesUtils.formatStartDaysAndTimes(this.createGroupFormData.createGroupSessionSlot),
        changeLink: '/group/create-a-group/group-days-and-times',
      },

      {
        key: 'Cohort',
        lines: [`${this.createGroupUtils.getCohortTextFromEnum(this.createGroupFormData.cohort)}`],
        changeLink: '/group/create-a-group/group-cohort',
      },
      {
        key: 'Sex',
        lines: [`${this.createGroupUtils.getSexTextFromEnum(this.createGroupFormData.sex)}`],
        changeLink: '/group/create-a-group/group-sex',
      },
      {
        key: 'PDU',
        lines: [`${this.createGroupFormData.pduName}`],
        changeLink: '/group/create-a-group/group-probation-delivery-unit',
      },
      {
        key: 'Delivery Location',
        lines: [`${this.createGroupFormData.deliveryLocationName}`],
        changeLink: '/group/create-a-group/group-delivery-location',
      },
      {
        key: 'Treatment Manager:',
        lines: [members.treatmentManager?.facilitator ?? 'Not assigned'],
        changeLink: '/group/create-a-group/group-facilitators',
      },
      {
        key: 'Facilitators:',
        lines:
          members.facilitators.length > 0 ? members.facilitators.map(member => member.facilitator) : ['None assigned'],
        changeLink: '/group/create-a-group/group-facilitators',
      },
    ]
    if (members.coverFacilitators.length > 0) {
      summaryList.push({
        key: 'Cover facilitators:',
        lines:
          members.coverFacilitators.length > 0
            ? members.coverFacilitators.map(member => member.facilitator)
            : ['None assigned'],
        changeLink: '/group/create-a-group/group-facilitators',
      })
    }
    return summaryList
  }
}
