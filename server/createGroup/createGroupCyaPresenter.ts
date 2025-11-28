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
    return `/group/create-a-group/group-delivery-location`
  }

  getCreateGroupSummary(): SummaryListItem[] {
    return [
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
    ]
  }
}
