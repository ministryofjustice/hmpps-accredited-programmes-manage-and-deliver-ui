import { CreateGroupRequest } from '@manage-and-deliver-api'
import { SummaryListItem } from '../utils/summaryList'
import CreateGroupUtils from './createGroupUtils'

export default class CreateGroupCyaPresenter {
  constructor(private readonly createGroupFormData: Partial<CreateGroupRequest>) {}

  createGroupUtils = new CreateGroupUtils()

  get text() {
    return { headingHintText: `Create group ${this.createGroupFormData.groupCode}` }
  }

  get backLinkUri() {
    return `/group/create-a-group/sex`
  }

  private sentenceCase(value: string | undefined): string {
    if (!value) return ''
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
  }

  getCreateGroupSummary(): SummaryListItem[] {
    return [
      {
        key: 'Group Code',
        lines: [`${this.createGroupFormData.groupCode}`],
        changeLink: '/group/create-a-group/code',
      },
      {
        key: 'Date',
        lines: [`${this.createGroupFormData.startedAtDate}`],
        changeLink: '/group/create-a-group/date',
      },
      {
        key: 'Day and time',
        lines:
          this.createGroupFormData.createGroupSessionSlot?.map(
            slot =>
              `${this.sentenceCase(slot.dayOfWeek)} ${slot.hour}:${String(slot.minutes).padStart(
                2,
                '0',
              )} ${slot.amOrPm.toLowerCase()}`,
          ) || [],
        changeLink: '/group/create-a-group/group-days-and-times',
      },

      {
        key: 'Cohort',
        lines: [`${this.createGroupUtils.getCohortTextFromEnum(this.createGroupFormData.cohort)}`],
        changeLink: '/group/create-a-group/cohort',
      },
      {
        key: 'Sex',
        lines: [`${this.createGroupUtils.getSexTextFromEnum(this.createGroupFormData.sex)}`],
        changeLink: '/group/create-a-group/sex',
      },
    ]
  }
}
