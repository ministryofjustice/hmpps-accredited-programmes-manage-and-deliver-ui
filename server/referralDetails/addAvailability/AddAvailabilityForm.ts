import { Request } from 'express'
import { ValidationChain, body } from 'express-validator'
import { CreateAvailability } from '@manage-and-deliver-api'
import FormUtils from '../../utils/formUtils'
import { FormData } from '../../utils/forms/formData'
import errorMessages from '../../utils/errorMessages'

export default class AddAvailabilityForm {
  constructor(private readonly request: Request) {}

  async data(): Promise<FormData<Partial<CreateAvailability>>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: AddAvailabilityForm.validations,
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
        availabilities: this.formatAvailabilities(this.request.body['availability-checkboxes']),
        otherDetails: this.request.body['other-availability-details-text-area'],
      },
      error: null,
    }
  }

  static get validations(): ValidationChain[] {
    return [
      body('availability-checkboxes').notEmpty().withMessage(errorMessages.addAvailability.availabilitiesEmpty),
      body('other-availability-details-text-area')
        .isLength({ max: 2000 })
        .withMessage(errorMessages.addAvailability.otherAvailabilityDetailsEmpty),
    ]
  }

  formatAvailabilities(availabilities: string[]) {
    const valuesToUpdateMap = new Map()
    const paramsArray = Array.isArray(availabilities) ? availabilities : [availabilities]
    paramsArray.forEach(item => {
      const [day, time] = item.split('-')

      if (!valuesToUpdateMap.has(day)) {
        valuesToUpdateMap.set(day, { label: day, slots: [] })
      }

      valuesToUpdateMap.get(day).slots.push({ label: time, value: true })
    })
    return Array.from(valuesToUpdateMap.values())
  }
}
