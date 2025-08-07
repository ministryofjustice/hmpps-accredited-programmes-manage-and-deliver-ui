import { ReferralDetails } from '@manage-and-deliver-api'
import { SummaryListItem } from '../utils/summaryList'
import ReferralDetailsPresenter from './referralDetailsPresenter'
import DateUtils from '../utils/dateUtils'

export default class OffenceHistoryPresenter extends ReferralDetailsPresenter {
  constructor(
    readonly details: ReferralDetails,
    readonly subNavValue: string,
    readonly id: string,
    readonly offenceHistory: {
      mainOffence: { offence: string; offenceCode: string; category: string; offenceDate: string; categoryCode: string }
      additionalOffences: {
        offence: string
        offenceCode: string
        category: string
        offenceDate: string
        categoryCode: string
      }[]
    },
  ) {
    super(details, subNavValue, id)
  }

  offenceHistorySummaryLists(): { title: string; summary: SummaryListItem[] }[] {
    const summaries = []
    summaries.push({
      title: 'Index Offence',
      summary: [
        {
          key: 'Offence',
          lines: [`${this.offenceHistory.mainOffence.offence} - ${this.offenceHistory.mainOffence.offenceCode}`],
        },
        {
          key: 'Category',
          lines: [this.offenceHistory.mainOffence.category],
        },
        {
          key: 'Offence date',
          lines: [DateUtils.formattedDate(new Date(this.offenceHistory.mainOffence.offenceDate))],
        },
      ],
    })
    this.offenceHistory.additionalOffences.forEach(offence => {
      summaries.push({
        title: `Additional offence (${offence.offenceCode})`,
        summary: [
          {
            key: 'Offence',
            lines: [`${offence.offence} - ${offence.offenceCode}`],
          },
          {
            key: 'Category',
            lines: [offence.category],
          },
          {
            key: 'Offence date',
            lines: [DateUtils.formattedDate(new Date(offence.offenceDate))],
          },
        ],
      })
    })
    return summaries
  }
}
