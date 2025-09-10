import { ReferralDetails } from '@manage-and-deliver-api'
import ReferralDetailsPresenter from './referralDetailsPresenter'
import { SummaryListItem } from '../utils/summaryList'

export default class LocationPresenter extends ReferralDetailsPresenter {
  constructor(
    readonly details: ReferralDetails,
    readonly subNavValue: string,
    readonly id: string,
  ) {
    super(details, subNavValue, id)
  }

  PreferredLocationsSummary(): { title: string; classes: string; summary: SummaryListItem[] } {
    return {
      title: 'Preferred programme delivery locations',
      classes: 'no-first-key',
      summary: [
        {
          lines: [`Last updated 3 April 2025 by Tom Saunders`],
        },
        {
          key: 'Preferred programme delivery locations',
          lines: [`East Sussex`],
        },
        {
          key: 'Locations the person cannot attend',
          lines: ['Brighton and Hove: Brighton Probation Office'],
        },
      ],
    }
  }
}
