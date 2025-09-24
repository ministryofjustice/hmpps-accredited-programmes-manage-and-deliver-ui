import { Attitude } from '@manage-and-deliver-api'
import RisksAndNeedsPresenter from '../risksAndNeedsPresenter'
import { SummaryListItem } from '../../utils/summaryList'

export default class AttitudesPresenter extends RisksAndNeedsPresenter {
  constructor(
    readonly subNavValue: string,
    readonly referralId: string,
    readonly attitude: Attitude,
    readonly referralStatus: string,
  ) {
    super(subNavValue, referralId, referralStatus)
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
