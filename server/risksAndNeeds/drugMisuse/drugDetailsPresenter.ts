import { DrugDetails, ReferralDetails } from '@manage-and-deliver-api'
import RisksAndNeedsPresenter from '../risksAndNeedsPresenter'
import { SummaryListItem } from '../../utils/summaryList'

export default class DrugDetailsPresenter extends RisksAndNeedsPresenter {
  constructor(
    readonly subNavValue: string,
    readonly referral: ReferralDetails,
    readonly drugDetails: DrugDetails,
    readonly isLdcUpdated: boolean | null = null,
    readonly isCohortUpdated: boolean | null = null,
  ) {
    super(subNavValue, referral, isLdcUpdated, isCohortUpdated)
  }

  drugDetailsSummaryList(): SummaryListItem[] {
    const { levelOfUseOfMainDrug } = this.drugDetails
    const { drugsMajorActivity } = this.drugDetails
    return [
      {
        key: '8.5 - Level of use of main drug',
        lines: [`${levelOfUseOfMainDrug ? `${levelOfUseOfMainDrug}` : 'No information available'}`],
      },
      {
        key: '8.9 - Using and obtaining drugs a major activity or occupation',
        lines: [`${drugsMajorActivity ? `${drugsMajorActivity}` : 'No information available'}`],
      },
    ]
  }
}
