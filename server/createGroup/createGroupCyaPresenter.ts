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
        key: 'Cohort',
        lines: [`${this.createGroupUtils.getCohortTextFromEnum(this.createGroupFormData.cohort)}`],
        changeLink: '/group/create-a-group/cohort',
      },
      {
        key: 'Gender',
        lines: [`${this.createGroupUtils.getSexTextFromEnum(this.createGroupFormData.sex)}`],
        changeLink: '/group/create-a-group/sex',
      },
    ]
  }
}
