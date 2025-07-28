import { ReferralDetails } from '@manage-and-deliver-api'
import { SummaryListItem } from '../utils/summaryList'
import ReferralDetailsPresenter from './referralDetailsPresenter'

export default class OffenceHistoryPresenter extends ReferralDetailsPresenter {
  constructor(
    readonly details: ReferralDetails,
    readonly subNavValue: string,
    readonly id: string,
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
          lines: ['Publishing or causing to be published a tobacco advertisement - 09144'],
        },
        {
          key: 'Category',
          lines: ['Public Health Offences'],
        },
        {
          key: 'Offence date',
          lines: ['11 June 2020'],
        },
      ],
    })
    summaries.push({
      title: 'Additional offence (08000)',
      summary: [
        {
          key: 'Offence',
          lines: ['Absconding from lawful custody - 08000'],
        },
        {
          key: 'Category',
          lines: ['Absconding from lawful custody'],
        },
        {
          key: 'Offence date',
          lines: ['18 January 2013'],
        },
      ],
    })
    summaries.push({
      title: 'Additional offence (08000)',
      summary: [
        {
          key: 'Offence',
          lines: ['\tClass unspecified - permitting premises to be used - 09329'],
        },
        {
          key: 'Category',
          lines: ['Permitting premises to be used for unlawful (drug-related) purposes'],
        },
        {
          key: 'Offence date',
          lines: ['23 September 2000'],
        },
      ],
    })
    return summaries
  }
}
