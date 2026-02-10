import { EditSessionFacilitatorsRequest } from '@manage-and-deliver-api'
import { Request } from 'express'
import { ValidationChain, body } from 'express-validator'
import errorMessages from '../../utils/errorMessages'
import { FormData } from '../../utils/forms/formData'
import FormUtils from '../../utils/formUtils'

export default class EditSessionFacilitatorsForm {
  constructor(private readonly request: Request) {}

  async editSessionFacilitatorsData(): Promise<FormData<Partial<EditSessionFacilitatorsRequest[]>>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: this.editSessionFacilitatorsValidations(),
    })

    const error = FormUtils.validationErrorFromResult(validationResult)
    if (error) {
      return {
        paramsForUpdate: null,
        error,
      }
    }
    const { _csrf, ...formValues } = this.request.body
    const facilitators = Object.values(formValues)
      .filter(value => value !== '')
      .map(value => JSON.parse(value as string)) as EditSessionFacilitatorsRequest[]
    return {
      paramsForUpdate: facilitators,
      error: null,
    }
  }

  private editSessionFacilitatorsValidations(): ValidationChain[] {
    const hasFacilitator = Object.entries(this.request.body).some(
      ([key, value]) => key.startsWith('edit-session-facilitator') && value !== '',
    )
    // TODO add validation for duplicate facilitator here
    return [
      body('edit-session-facilitator')
        .custom(() => {
          return hasFacilitator
        })
        .withMessage(errorMessages.editSession.editSessionFacilitatorEmpty),
    ]
  }
}
