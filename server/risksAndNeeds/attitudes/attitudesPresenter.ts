import { Attitude, ReferralDetails } from '@manage-and-deliver-api'
import RisksAndNeedsPresenter from '../risksAndNeedsPresenter'
import { SummaryListItem } from '../../utils/summaryList'

export default class AttitudesPresenter extends RisksAndNeedsPresenter {
  constructor(
    readonly subNavValue: string,
    readonly referral: ReferralDetails,
    readonly attitude: Attitude,
    readonly isLdcUpdated: boolean | null = null,
    readonly isCohortUpdated: boolean | null = null,
  ) {
    super(subNavValue, referral, isLdcUpdated, isCohortUpdated)
  }

  attitudeSummaryList(): SummaryListItem[] {
    return [
      {
        key: '12.1 – Pro-criminal attitudes',
        lines: [
          `${this.attitude.proCriminalAttitudes ? `${this.attitude.proCriminalAttitudes}` : 'No information available'}`,
        ],
      },
      {
        key: '12.8 – Motivation to address offending behaviour',
        lines: [
          `${this.attitude.motivationToAddressBehaviour ? `${this.attitude.motivationToAddressBehaviour}` : 'No information available'}`,
        ],
      },
    ]
  }
}
