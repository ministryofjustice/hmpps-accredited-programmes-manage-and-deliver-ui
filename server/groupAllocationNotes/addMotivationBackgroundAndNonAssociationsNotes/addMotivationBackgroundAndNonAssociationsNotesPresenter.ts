import { ReferralDetails, ReferralMotivationBackgroundAndNonAssociations } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class AddMotivationBackgroundAndNonAssociationsNotesPresenter {
  constructor(
    readonly referral: ReferralDetails,
    readonly motivationBackgroundAndNonAssociations: ReferralMotivationBackgroundAndNonAssociations,
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
  ) {}

  get text() {
    return {
      pageHeading: `Provide information about motivation, background and non-associations`,
      motivatedCharacterCount: {
        label: `Is the person motivated to participate in an Accredited Programme?`,
        hint: `For example, are they motivated to address their thinking or behaviour, even if they maintain their innocence.`,
      },
      otherPeopleCharacterCount: {
        label: `Are there other people on probation who the person should not attend a group with?`,
        hint: `Include any non-associations and other relevant personal relationships, such as co-defendants or gang affiliations.`,
      },
      otherConsiderationsCharacterCount: {
        label: `Other considerations`,
        hint: `Include other information that could help with group composition, such as information to help create a diverse group.`,
      },
    }
  }

  get formActionLink(): string {
    return `/referral/${this.referral.id}/add-motivation-background-and-non-associations`
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get utils() {
    return new PresenterUtils(this.userInputData)
  }

  get fields() {
    return {
      maintainInnocence: {
        value: this.utils.booleanValue(
          this.motivationBackgroundAndNonAssociations.maintainsInnocence,
          'maintains-innocence',
        ),
        errorMessage: PresenterUtils.errorMessage(this.validationError, ' maintains-innocence'),
      },
      motivated: {
        value: this.utils.stringValue(
          this.motivationBackgroundAndNonAssociations.motivations,
          'motivated-character-count',
        ),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'motivated-character-count'),
      },
      nonAssociations: {
        value: this.utils.stringValue(
          this.motivationBackgroundAndNonAssociations.nonAssociations,
          'non-associations-character-count',
        ),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'non-associations-character-count'),
      },
      otherConsiderations: {
        value: this.utils.stringValue(
          this.motivationBackgroundAndNonAssociations.otherConsiderations,
          'other-considerations-character-count',
        ),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'other-considerations-character-count'),
      },
    }
  }
}
