import { Request } from 'express'
import { body, ValidationChain } from 'express-validator'
import { SessionData } from 'express-session'
import errorMessages from '../utils/errorMessages'
import { FormData } from '../utils/forms/formData'
import FormUtils from '../utils/formUtils'

export type LocationFormData = {
  referralId: string
  pdus: string[]
  addOtherPduLocations: string
  otherPduLocations?: string[]
  cannotAttendLocations?: string
}

export default class AddLocationPreferenceForm {
  constructor(
    private readonly request: Request,
    private readonly referralId: string,
  ) {}

  async data(): Promise<FormData<Partial<LocationFormData>>> {
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

    return {
      paramsForUpdate: {
        referralId: this.referralId,
        pdus: this.request.body['pdu-locations'],
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
    return {
      paramsForUpdate: {
        referralId: this.referralId,
        otherPduLocations: createPduList(this.request.body),
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
          .if(body('cannot-attend-locations-radio').equals('Yes'))
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
        cannotAttendLocations: this.request.body['cannot-attend-locations-text-area'],
      },
      error: null,
    }
  }
}
