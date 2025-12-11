import { CreateGroupRequest, CreateGroupTeamMember } from '@manage-and-deliver-api'
import { SummaryListItem } from '../../utils/summaryList'
import CreateGroupUtils from '../createGroupUtils'

export default class CreateGroupCyaPresenter {
  constructor(private readonly createGroupFormData: Partial<CreateGroupRequest>) {}

  createGroupUtils = new CreateGroupUtils()

  get text() {
    return { headingHintText: `Create group ${this.createGroupFormData.groupCode}` }
  }

  get backLinkUri() {
    return `/group/create-a-group/group-delivery-location`
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

  private formatTime(hour: number, minutes: number, amOrPm: string): string {
    const mins = String(minutes).padStart(2, '0')
    const period = amOrPm.toLowerCase()

    if (hour === 12 && mins === '00' && period === 'pm') {
      return 'midday'
    }

    if (hour === 12 && mins === '00' && period === 'am') {
      return 'midnight'
    }

    if (minutes === 0) {
      return `${hour}${period}`
    }

    return `${hour}:${mins}${period}`
  }

  private addTwoAndHalfHours(hour: number, minutes: number, amOrPm: string) {
    let h = hour % 12
    if (amOrPm.toLowerCase() === 'pm') {
      h += 12
    }

    let totalMinutes = h * 60 + minutes

    totalMinutes += 150

    totalMinutes %= 24 * 60

    const endHour24 = Math.floor(totalMinutes / 60)
    const endMinutes = totalMinutes % 60

    const endAmOrPm = endHour24 >= 12 ? 'pm' : 'am'
    let endHour12 = endHour24 % 12
    if (endHour12 === 0) endHour12 = 12

    return { endHour12, endMinutes, endAmOrPm }
  }

  private sentenceCase(value: string | undefined): string {
    if (!value) return ''
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
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
        lines: [`${this.createGroupFormData.startedAtDate}`],
        changeLink: '/group/create-a-group/group-start-date',
      },

      {
        key: 'Day and time',
        lines:
          this.createGroupFormData.createGroupSessionSlot?.map(slot => {
            const day = this.sentenceCase(slot.dayOfWeek)
            const startHour = slot.hour
            const startMinutes = slot.minutes ?? 0
            const startAmOrPm = slot.amOrPm
            const formattedStart = this.formatTime(startHour, startMinutes, startAmOrPm)
            const { endHour12, endMinutes, endAmOrPm } = this.addTwoAndHalfHours(startHour, startMinutes, startAmOrPm)

            const formattedEnd = this.formatTime(endHour12, endMinutes, endAmOrPm)

            return `${day}s, ${formattedStart} to ${formattedEnd}`
          }) || [],
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
