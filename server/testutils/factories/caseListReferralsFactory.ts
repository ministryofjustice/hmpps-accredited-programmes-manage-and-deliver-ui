import { CaseListReferrals, ReferralCaseListItem } from '@manage-and-deliver-api'
import { Factory } from 'fishery'
import pageFactory from './pageFactory'
import { Page } from '../../shared/models/pagination'
import referralCaseListItemFactory from './referralCaseListItem'
import TestUtils from '../testUtils'

class CaseListReferralsFactory extends Factory<CaseListReferrals> {}
const referralCaseListItem = referralCaseListItemFactory.build()

export default CaseListReferralsFactory.define(() => ({
  pagedReferrals: pageFactory.pageContent([referralCaseListItem]).build() as Page<ReferralCaseListItem>,
  otherTabTotal: 10,
  filters: TestUtils.createCaseListFilters(),
}))
