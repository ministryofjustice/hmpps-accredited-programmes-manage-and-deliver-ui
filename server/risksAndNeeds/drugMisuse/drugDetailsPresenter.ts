import { DrugDetails } from '@manage-and-deliver-api'
import RisksAndNeedsPresenter from '../risksAndNeedsPresenter'
import { SummaryListItem } from '../../utils/summaryList'

export default class DrugDetailsPresenter extends RisksAndNeedsPresenter {
  constructor(
    readonly subNavValue: string,
    readonly referralId: string,
    readonly drugDetails: DrugDetails,
  ) {
    super(subNavValue, referralId)
  }

  drugDetailsSummaryList(): SummaryListItem[] {
    const { levelOfUseOfMainDrug } = this.drugDetails
    const { drugsMajorActivity } = this.drugDetails
    return [
      {
        key: '8.5 - Level of use of main drug',
        lines: [`${levelOfUseOfMainDrug ? `${levelOfUseOfMainDrug}` : ''}`],
      },
      {
        key: '8.9 - Using and obtaining drugs a major activity or occupation',
        lines: [`${drugsMajorActivity ? `${drugsMajorActivity}` : ''}`],
      },
    ]
  }
}
