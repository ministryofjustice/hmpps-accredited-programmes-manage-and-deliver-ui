import { ReferralStatusHistory } from '@manage-and-deliver-api'
import ReferralLayoutPresenter, { HorizontalNavValues } from '../shared/referral/referralLayoutPresenter'

export interface TimelineItem {
  label: {
    text: string
  }
  html?: string
  datetime?: {
    timestamp: string
    type: string
  }
}

export default class StatusHistoryPresenter extends ReferralLayoutPresenter {
  constructor(
    readonly referralId: string,
    private readonly statusHistory: ReferralStatusHistory[],
  ) {
    super(HorizontalNavValues.statusHistoryTab, referralId)
  }

  get pageHeading(): string {
    return 'Status history'
  }

  get pageSubHeading(): string {
    return 'Timeline of status changes'
  }

  get timelineItems(): TimelineItem[] {
    return this.statusHistory.map((status) => ({
      label: {
        text: status.referralStatusDescriptionName
      }
    }))
  }
}