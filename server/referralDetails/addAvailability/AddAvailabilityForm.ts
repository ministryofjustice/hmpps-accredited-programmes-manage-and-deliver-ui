import { Request } from 'express'
import { ValidationChain, body } from 'express-validator'
import { CreateAvailability } from '@manage-and-deliver-api'
import FormUtils from '../../utils/formUtils'
import { FormData } from '../../utils/forms/formData'
import errorMessages from '../../utils/errorMessages'

export default class AddAvailabilityForm {
  constructor(
    private readonly request: Request,
    private readonly referralId: string,
  ) {}

  async data(): Promise<FormData<CreateAvailability>> {
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
        referralId: this.referralId,
        availabilities: this.formatAvailabilities(this.request.body['availability-checkboxes']),
        otherDetails: this.request.body['other-availability-details-text-area'],
        startDate: new Date().toISOString().split('T')[0],
        ...(this.request.body['end-date'] === 'Yes' && { endDate: this.formatDate(this.request.body.date) }),
      },
      error: null,
    }
  }

  static get validations(): ValidationChain[] {
    const dateRegex = /\b(0?[1-9]|[12]\d|3[01])\/(0?[1-9]|1[0-2])\/(\d{4})\b/g
    return [
      body('availability-checkboxes').notEmpty().withMessage(errorMessages.addAvailability.availabilitiesEmpty),
      body('other-availability-details-text-area')
        .isLength({ max: 2000 })
        .withMessage(errorMessages.addAvailability.otherAvailabilityDetailsEmpty),
      body('end-date').notEmpty().withMessage(errorMessages.addAvailabilityDates.requireEndDateEmpty),
      body('date')
        .if(body('end-date').equals('Yes'))
        .matches(dateRegex)
        .withMessage(errorMessages.addAvailabilityDates.endDateEmpty)
        .bail()
        .custom(value => {
          // Convert DD/MM/YYYY to Date object
          const [day, month, year] = value.split('/')
          const inputDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10))
          const minDate = new Date()

          if (inputDate <= minDate) {
            throw new Error(errorMessages.addAvailabilityDates.endDateInPast)
          }
          return true
        }),
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

  formatDate(date: string) {
    const [day, month, year] = date.split('/')
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }
}
