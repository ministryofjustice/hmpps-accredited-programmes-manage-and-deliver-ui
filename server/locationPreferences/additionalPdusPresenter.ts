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
    readonly hasUpdatedAdditionalLocationData: boolean,
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

  // Returns a list of offices that can be used to pre-populate checkboxes if they were previously selected
  selectedLocationValues(updatedData: CreateDeliveryLocationPreferences) {
    const updateDataDeliveryLocations = updatedData.preferredDeliveryLocations.flatMap(
      location => location.deliveryLocations,
    )
    if (this.currentFormData && this.hasUpdatedAdditionalLocationData) {
      return updateDataDeliveryLocations.map(it => it.code)
    }
    return this.preferredLocationReferenceData.existingDeliveryLocationPreferences
      ? this.preferredLocationReferenceData.existingDeliveryLocationPreferences.canAttendLocationsValues.map(
          item => item.value,
        )
      : []
  }
}
