import { AlcoholMisuseDetails } from '@manage-and-deliver-api'
import RisksAndNeedsPresenter from '../risksAndNeedsPresenter'
import { SummaryListItem } from '../../utils/summaryList'

export default class AlcoholMisusePresenter extends RisksAndNeedsPresenter {
  constructor(
    readonly subNavValue: string,
    readonly referralId: string,
    readonly alcoholMisuseDetails: AlcoholMisuseDetails,
  ) {
    super(subNavValue, referralId)
  }

  alcoholMisuseSummaryList(): SummaryListItem[] {
    return [
      {
        key: '9.1 – Is current use a problem?',
        lines: [`${this.alcoholMisuseDetails.currentUse}`, `${this.alcoholMisuseDetails.alcoholIssuesDetails}`],
      },
      {
        key: '9.2 – Binge drinking or excessive alcohol use in the last 6 months',
        lines: [`${this.alcoholMisuseDetails.bingeDrinking}`],
      },
      {
        key: '9.3 – Level of alcohol misuse in the past',
        lines: [`${this.alcoholMisuseDetails.frequencyAndLevel}`],
      },
    ]
  }
}
