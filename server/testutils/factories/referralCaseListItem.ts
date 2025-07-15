import { ReferralCaseListItem } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

class ReferralCaseListItemFactory extends Factory<ReferralCaseListItem> {}

export default ReferralCaseListItemFactory.define(({ sequence }) => ({
  crn: '1232314',
  personName: 'feksoipgjes',
  referralStatus: 'fjewioghjewoi',
}))
