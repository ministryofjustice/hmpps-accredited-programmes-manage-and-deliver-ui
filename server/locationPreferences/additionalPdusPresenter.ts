import { ReferralDetails } from '@manage-and-deliver-api'
import { SessionData } from 'express-session'
import { FormValidationError } from '../utils/formValidationError'
import PresenterUtils from '../utils/presenterUtils'

export default class AdditionalPdusPresenter {
  constructor(
    readonly id: string,
    readonly details: ReferralDetails,
    readonly currentFormData: SessionData['locationPreferenceFormData'],
  ) {}

  // get locationButtonFormAction(): string {
  //   return `/referral/${this.id}/add-location-preferences/cannot`
  // }
}
