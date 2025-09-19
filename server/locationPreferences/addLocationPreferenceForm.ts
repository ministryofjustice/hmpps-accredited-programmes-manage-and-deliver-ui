import { Request } from 'express'
import { body, ValidationChain } from 'express-validator'
import { PreferredDeliveryLocation } from '@manage-and-deliver-api'
import errorMessages from '../utils/errorMessages'
import { FormData } from '../utils/forms/formData'
import FormUtils from '../utils/formUtils'

export type LocationFormData = {
  referralId: string
  locations: PreferredDeliveryLocation[]
  addOtherPduLocations: string
  otherPduLocations?: PreferredDeliveryLocation[]
  cannotAttendLocations?: string
}

export default class AddLocationPreferenceForm {
  constructor(
    private readonly request: Request,
    private readonly referralId: string,
  ) {}

  async primaryPduData(): Promise<FormData<Partial<LocationFormData>>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: AddLocationPreferenceForm.pduValidations,
    })

    const error = FormUtils.validationErrorFromResult(validationResult)
    if (error) {
      return {
        paramsForUpdate: null,
        error,
      }
    }

    this.request.body['pdu-locations'] = Array.isArray(this.request.body['pdu-locations'])
      ? this.request.body['pdu-locations']
      : [this.request.body['pdu-locations']]

    const preferredDeliveryLocations = [
      {
        pduCode: this.request.session.locationPreferenceFormData.preferredLocationReferenceData.primaryPdu.code,
        pduDescription: this.request.session.locationPreferenceFormData.preferredLocationReferenceData.primaryPdu.name,
        deliveryLocations:
          this.request.session.locationPreferenceFormData.preferredLocationReferenceData.primaryPdu.deliveryLocations
            .filter(it => this.request.body['pdu-locations'].includes(it.value))
            .map(location => ({ code: location.value, description: location.label })),
      },
    ]

    return {
      paramsForUpdate: {
        referralId: this.referralId,
        locations: preferredDeliveryLocations,
        addOtherPduLocations: this.request.body['add-other-pdu-locations'],
      },
      error: null,
    }
  }

  static get pduValidations(): ValidationChain[] {
    return [body('add-other-pdu-locations').notEmpty().withMessage(errorMessages.addPreferredLocations.addAnotherPDU)]
  }

  async additionalPdusData(): Promise<FormData<Partial<LocationFormData>>> {
    const createPduList = (data: Record<string, string | string[]>): string[] => {
      return Object.entries(data)
        .filter(([key]) => key !== '_csrf')
        .flatMap(([, value]) => (Array.isArray(value) ? value : [value]))
        .filter(Boolean)
    }

    const selectedOtherPduList = createPduList(this.request.body)

    const otherPdusFullData =
      this.request.session.locationPreferenceFormData.preferredLocationReferenceData.otherPdusInSameRegion
        .map(pdu => {
          // Filter delivery locations to only include matching office codes
          const matchingLocations = pdu.deliveryLocations
            .filter(location => selectedOtherPduList.includes(location.value))
            .map(location => ({ code: location.value, description: location.label }))

          // Only include PDUs that have at least one matching location
          if (matchingLocations.length > 0) {
            return {
              pduCode: pdu.code,
              pduDescription: pdu.name,
              deliveryLocations: matchingLocations,
            }
          }
          return null
        })
        .filter(item => item !== null) // Remove PDUs with no matching locations

    return {
      paramsForUpdate: {
        referralId: this.referralId,
        otherPduLocations: otherPdusFullData,
      },
      error: null,
    }
  }

  async cannotAttendLocationData(): Promise<FormData<Partial<LocationFormData>>> {
    const validations = (): ValidationChain[] => {
      return [
        body('cannot-attend-locations-radio')
          .notEmpty()
          .withMessage(errorMessages.cannotAttendLocations.cannotAttendLocationsRadios.requiredRadioSelection),
        body('cannot-attend-locations-text-area')
          .if(body('cannot-attend-locations-radio').equals('yes'))
          .notEmpty()
          .withMessage(errorMessages.cannotAttendLocations.cannotAttendTextArea.inputRequired),
        body('cannot-attend-locations-text-area')
          .isLength({ max: 2000 })
          .withMessage(errorMessages.cannotAttendLocations.cannotAttendTextArea.exceededCharacterLimit),
      ]
    }

    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: validations(),
    })

    const error = FormUtils.validationErrorFromResult(validationResult)
    if (error) {
      return {
        paramsForUpdate: null,
        error,
      }
    }

    return {
      paramsForUpdate: {
        referralId: this.referralId,
        cannotAttendLocations:
          this.request.body['cannot-attend-locations-radio'] === 'yes'
            ? this.request.body['cannot-attend-locations-text-area']
            : null,
      },
      error: null,
    }
  }
}
