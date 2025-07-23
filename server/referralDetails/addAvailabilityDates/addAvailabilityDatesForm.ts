import { Request } from 'express'
import { ValidationChain, body } from 'express-validator'
import { CreateAvailability } from '@manage-and-deliver-api'
import FormUtils from '../../utils/formUtils'
import { FormData } from '../../utils/forms/formData'
import errorMessages from '../../utils/errorMessages'

export default class AddAvailabilityDatesForm {
  constructor(private readonly request: Request) {}

  async data(): Promise<FormData<Partial<CreateAvailability>>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: AddAvailabilityDatesForm.validations,
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
        startDate: new Date().toLocaleDateString('en-GB'),
        ...(this.request.body['end-date'] === 'Yes' && { endDate: this.request.body.date }),
      },
      error: null,
    }
  }

  static get validations(): ValidationChain[] {
    // Valid date formats - DD/MM/YYYY D/MM/YYY DD/M/YYYY D/M/YYYY
    const dateRegex = /\b(0?[1-9]|[12]\d|3[01])\/(0?[1-9]|1[0-2])\/(\d{4})\b/g
    return [
      body('end-date').notEmpty().withMessage(errorMessages.addAvailabilityDates.requireEndDateEmpty),
      body('date')
        .if(body('end-date').equals('Yes'))
        .matches(dateRegex)
        .withMessage(errorMessages.addAvailabilityDates.endDateEmpty),
    ]
  }
}
