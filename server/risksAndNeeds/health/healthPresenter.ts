import { Health } from '@manage-and-deliver-api'
import RisksAndNeedsPresenter from '../risksAndNeedsPresenter'
import { SummaryListItem } from '../../utils/summaryList'

export default class HealthPresenter extends RisksAndNeedsPresenter {
  constructor(
    readonly subNavValue: string,
    readonly referralId: string,
    readonly health: Health,
    readonly referralStatus: string,
  ) {
    super(subNavValue, referralId, referralStatus)
  }

  healthSummaryList(): SummaryListItem[] {
    const hasHealthCondition = HealthPresenter.yesOrNo(this.health.anyHealthConditions)
    const { description } = this.health

    return [
      {
        key: 'General health - any physical or mental health conditions? (optional)',
        lines: [`${hasHealthCondition}${description ? `\n\n${description}` : ''}`],
      },
    ]
  }

  static yesOrNo(value?: boolean): 'No' | 'Yes' {
    return value ? 'Yes' : 'No'
  }
}
