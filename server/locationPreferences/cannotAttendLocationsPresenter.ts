import { ReferralDetails } from '@manage-and-deliver-api'
import { SessionData } from 'express-session'
import PresenterUtils from '../utils/presenterUtils'
import { FormValidationError } from '../utils/formValidationError'

export default class CannotAttendLocationsPresenter {
  constructor(
    readonly id: string,
    readonly details: ReferralDetails,
    readonly currentFormData: SessionData['locationPreferenceFormData'],
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
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
        value: this.utils.stringValue(null, 'add-other-pdu-locations'),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'add-other-pdu-locations'),
      },
      cannotAttendLocationsTextArea: {
        value: this.utils.stringValue(null, 'add-other-pdu-locations'),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'add-other-pdu-locations'),
      },
    }
  }
}
