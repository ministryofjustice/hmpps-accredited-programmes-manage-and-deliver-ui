import { DeliveryLocationPreferences, ReferralDetails } from '@manage-and-deliver-api'
import { SummaryListItem } from '../utils/summaryList'
import ReferralDetailsPresenter from './referralDetailsPresenter'

export default class LocationPresenter extends ReferralDetailsPresenter {
  constructor(
    readonly details: ReferralDetails,
    readonly subNavValue: string,
    readonly id: string,
    readonly deliveryLocationPreferences: DeliveryLocationPreferences,
  ) {
    super(details, subNavValue, id)
  }

  preferredLocationsSummary(): { title: string; classes: string; summary: SummaryListItem[] } {
    const { lastUpdatedAt, lastUpdatedBy, preferredDeliveryLocations, cannotAttendLocations } =
      this.deliveryLocationPreferences

    let summaryItems: SummaryListItem[] = [
      {
        key: 'Preferred programme delivery locations',
        lines: preferredDeliveryLocations.length !== 0 ? preferredDeliveryLocations : ['No information added'],
      },
      {
        key: 'Locations the persona cannot attend',
        lines: [cannotAttendLocations ?? 'No information added'],
      },
    ]

    // Adds to the start of the arry if fields are not null
    if (lastUpdatedAt && lastUpdatedBy) {
      summaryItems = [{ lines: [`Last updated ${lastUpdatedAt} by ${lastUpdatedBy}`] }, ...summaryItems]
    }

    return {
      title: 'Preferred programme delivery locations',
      classes: lastUpdatedAt && lastUpdatedBy ? 'no-first-key' : '',
      summary: summaryItems,
    }
  }
}
