import PersonalDetails from '../../models/PersonalDetails'
import { FormValidationError } from '../../utils/formValidationError'

export default class AddAvailabilityDatesPresenter {
  constructor(
    private readonly personalDetails: PersonalDetails,
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
  ) {}
}
