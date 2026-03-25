import { Request } from 'express'
import { body, ValidationChain } from 'express-validator'
import { CreateOrUpdateReferralMotivationBackgroundAndNonAssociations } from '@manage-and-deliver-api'
import { FormData } from '../../utils/forms/formData'
import errorMessages from '../../utils/errorMessages'
import FormUtils from '../../utils/formUtils'

export default class AddMotivationBackgroundAndNonAssociatesForm {
  constructor(private readonly request: Request) {}

  async addMotivationBackgroundAndNonAssociatesData(): Promise<
    FormData<CreateOrUpdateReferralMotivationBackgroundAndNonAssociations>
  > {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: this.addMotivationBackgroundAndNonAssociatesValidations,
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
        maintainsInnocence: this.getMaintainsInnocenceValueToSend(),
        motivations: this.request.body['motivated-character-count'],
        otherConsiderations: this.request.body['other-considerations-character-count'],
        nonAssociations: this.request.body['non-associations-character-count'],
      },
      error: null,
    }
  }

  private getMaintainsInnocenceValueToSend(): boolean | null {
    if (this.request.body['maintains-innocence'] === 'yes') {
      return true
    }
    if (this.request.body['maintains-innocence'] === 'no') {
      return false
    }
    return null
  }

  get addMotivationBackgroundAndNonAssociatesValidations(): ValidationChain[] {
    return [
      body('motivated-character-count')
        .isLength({ max: 2000 })
        .withMessage(errorMessages.motivationBackgroundAndNonAssociations.exceededCharacterLimit),
      body('other-considerations-character-count')
        .isLength({ max: 2000 })
        .withMessage(errorMessages.motivationBackgroundAndNonAssociations.exceededCharacterLimit),
      body('non-associations-character-count')
        .isLength({ max: 2000 })
        .withMessage(errorMessages.motivationBackgroundAndNonAssociations.exceededCharacterLimit),
    ]
  }
}
