import { DeliveryLocationPreferencesFormData, ReferralDetails } from '@manage-and-deliver-api'
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
    readonly id: string,
    readonly details: ReferralDetails,
    readonly preferredLocationReferenceData: DeliveryLocationPreferencesFormData,
    readonly backlinkUri: string | null,
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

  get utils() {
    return new PresenterUtils(this.userInputData)
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get locationButtonFormAction(): string {
    return `/referral/${this.id}/add-location-preferences`
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
