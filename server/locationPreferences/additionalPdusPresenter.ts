import {
  CreateDeliveryLocationPreferences,
  DeliveryLocationPreferencesFormData,
  ReferralDetails,
} from '@manage-and-deliver-api'

export default class AdditionalPdusPresenter {
  public readonly pdus: {
    name: string
    code: string
    offices: { value: string; label: string }[]
  }[] = []

  constructor(
    readonly referralId: string,
    readonly details: ReferralDetails,
    readonly preferredLocationReferenceData: DeliveryLocationPreferencesFormData,
    readonly currentFormData: CreateDeliveryLocationPreferences,
  ) {
    this.pdus = (preferredLocationReferenceData.otherPdusInSameRegion ?? []).map(pdu => ({
      code: pdu.code,
      name: pdu.name,
      offices: pdu.deliveryLocations,
    }))
  }

  get backLinkUri() {
    return `/referral/${this.referralId}/add-location-preferences`
  }

  private containsNonPrimaryPduData(updatedData: CreateDeliveryLocationPreferences, primaryPduCode: string) {
    return updatedData.preferredDeliveryLocations.some(location => location.pduCode !== primaryPduCode)
  }

  selectedLocationValues(updatedData: CreateDeliveryLocationPreferences, primaryPduCode: string) {
    const stuff = updatedData.preferredDeliveryLocations.flatMap(location => location.deliveryLocations)
    if (this.currentFormData && this.containsNonPrimaryPduData(updatedData, primaryPduCode)) {
      return stuff.map(it => it.code)
    }
    return this.preferredLocationReferenceData.existingDeliveryLocationPreferences
      ? this.preferredLocationReferenceData.existingDeliveryLocationPreferences.canAttendLocationsValues.map(
          item => item.value,
        )
      : []
  }
}
