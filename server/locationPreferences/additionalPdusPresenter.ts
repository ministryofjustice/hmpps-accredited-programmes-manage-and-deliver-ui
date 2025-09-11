import { ReferralDetails } from '@manage-and-deliver-api'
import { SessionData } from 'express-session'
import { FormValidationError } from '../utils/formValidationError'
import PresenterUtils from '../utils/presenterUtils'

export default class AdditionalPdusPresenter {
  public readonly pdus: {
    name: string
    code: string
    offices: { value: string; label: string }[]
  }[] = []

  constructor(
    readonly id: string,
    readonly details: ReferralDetails,
    readonly currentFormData: SessionData['locationPreferenceFormData'],
  ) {
    this.pdus = (currentFormData.referenceData.otherPdusInSameRegion ?? []).map(pdu => ({
      code: pdu.code,
      name: pdu.name,
      offices: pdu.deliveryLocations,
    }))
  }
}
