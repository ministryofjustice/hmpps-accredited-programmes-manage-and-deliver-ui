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
    readonly updateData: CreateDeliveryLocationPreferences,
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
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
  }

  // Returns a list of offices that can be used to pre-populate checkboxes if they were previously selected
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

  private get utils() {
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

  // Returns a boolean to allow radio button to be pre-selected based on if previous additional pdu offices were selected.
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
