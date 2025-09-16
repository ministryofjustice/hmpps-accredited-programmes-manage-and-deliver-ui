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
    readonly id: string,
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
}
