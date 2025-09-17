import {
  CreateDeliveryLocationPreferences,
  DeliveryLocationPreferencesFormData,
  ReferralDetails,
} from '@manage-and-deliver-api'
import { FormValidationError } from '../utils/formValidationError'
import PresenterUtils from '../utils/presenterUtils'

export interface DeliveryLocationOptions {
  pdu: {
    name: string
    code: string
    isPrimaryPduForReferral: boolean
  }
  offices: {
    value: string
    label: string
  }[]
}

export default class LocationPreferencesPresenter {
  public readonly deliveryLocationOptions: DeliveryLocationOptions[] = []

  constructor(
    readonly referralId: string,
    readonly details: ReferralDetails,
    readonly preferredLocationReferenceData: DeliveryLocationPreferencesFormData,
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
    readonly updateData: CreateDeliveryLocationPreferences,
  ) {
    this.deliveryLocationOptions = [
      {
        pdu: {
          code: preferredLocationReferenceData.primaryPdu.code,
          isPrimaryPduForReferral: true,
          name: preferredLocationReferenceData.primaryPdu.name,
        },
        offices: preferredLocationReferenceData.primaryPdu.deliveryLocations,
      },
    ]
    // const dataForPrePopulation = this.updateData
    //   ? this.updateData
    //   : preferredLocationReferenceData.existingDeliveryLocationPreferences
  }

  selectedLocationValues(updatedData: CreateDeliveryLocationPreferences, pduCode: string) {
    if (this.updateData) {
      return updatedData.preferredDeliveryLocations
        .find(location => location.pduCode === pduCode)
        .deliveryLocations.map(deliveryLocation => deliveryLocation.code)
    }
    if (this.preferredLocationReferenceData.existingDeliveryLocationPreferences) {
      return this.preferredLocationReferenceData.existingDeliveryLocationPreferences.canAttendLocationsValues.map(
        item => item.value,
      )
    }
    return []
  }

  get utils() {
    return new PresenterUtils(this.userInputData)
  }

  get backLinkUri() {
    return `/referral-details/${this.referralId}/location#location`
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get locationButtonFormAction(): string {
    return `/referral/${this.referralId}/add-location-preferences`
  }

  get hasPreviouslySelectedOtherPdus(): boolean {
    const primaryOffices = this.preferredLocationReferenceData.primaryPdu.deliveryLocations.map(
      location => location.value,
    )
    let hasPreviouslySelected = false
    if (this.preferredLocationReferenceData.existingDeliveryLocationPreferences?.canAttendLocationsValues.length > 0) {
      this.preferredLocationReferenceData.existingDeliveryLocationPreferences.canAttendLocationsValues.forEach(
        location => {
          if (!primaryOffices.includes(location.value)) {
            hasPreviouslySelected = true
          }
        },
      )
    } else {
      return null
    }
    return hasPreviouslySelected
  }

  get fields() {
    return {
      otherPduRequired: {
        value: this.utils.stringValue(null, 'add-other-pdu-locations'),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'add-other-pdu-locations'),
      },
    }
  }
}
