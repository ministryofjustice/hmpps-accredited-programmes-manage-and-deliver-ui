import { CohortEnum, ReferralDetails } from '@manage-and-deliver-api'
import { ButtonArgs, SelectArgsItem, TableArgsHeadElement } from '../utils/govukFrontendTypes'
import Pagination from '../utils/pagination/pagination'
import { convertToTitleCase } from '../utils/utils'
import ReferralLayoutPresenter, { HorizontalNavValues } from '../shared/referral/referralLayoutPresenter'

export default class GroupAllocationNotesPresenter extends ReferralLayoutPresenter {
  constructor(
    readonly referral: ReferralDetails,
    readonly isLdcUpdated: boolean | null = null,
    readonly isCohortUpdated: boolean | null = null,
  ) {
    super(HorizontalNavValues.groupAllocationNotesTab, referral, isLdcUpdated, isCohortUpdated)
  }
}
