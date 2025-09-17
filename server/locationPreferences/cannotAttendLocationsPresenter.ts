import { DeliveryLocationPreferencesFormData, ReferralDetails } from '@manage-and-deliver-api'
import PresenterUtils from '../utils/presenterUtils'
import { FormValidationError } from '../utils/formValidationError'

export default class CannotAttendLocationsPresenter {
  constructor(
    readonly id: string,
    readonly details: ReferralDetails,
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
    readonly preferredLocationReferenceData: DeliveryLocationPreferencesFormData,
    readonly backLinkUri: string,
  ) {}

  get utils() {
    return new PresenterUtils(this.userInputData)
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  readonly text = {
    cannotAttendTextArea: {
      label: 'Give details of the locations they cannot attend',
    },
  }

  get fields() {
    return {
      cannotAttendLocationsRadioButton: {
        value: this.utils.stringValue(
          this.preferredLocationReferenceData.existingDeliveryLocationPreferences?.cannotAttendLocations ? 'yes' : 'no',
          'cannot-attend-locations-radio',
        ),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'cannot-attend-locations-radio'),
      },
      cannotAttendLocationsTextArea: {
        value: this.utils.stringValue(
          this.preferredLocationReferenceData.existingDeliveryLocationPreferences?.cannotAttendLocations
            ? this.preferredLocationReferenceData.existingDeliveryLocationPreferences.cannotAttendLocations
            : null,
          'cannot-attend-locations-text-area',
        ),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'cannot-attend-locations-text-area'),
      },
    }
  }
}
