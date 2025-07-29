import { Availability } from '@manage-and-deliver-api'
import PersonalDetails from '../../models/PersonalDetails'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class AddAvailabilityPresenter {
  constructor(
    private readonly personalDetails: PersonalDetails,
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
    readonly backlinkUri: string | null,
    private readonly availability: Availability,
    private readonly referralId: string | null = null,
  ) {}

  get utils() {
    return new PresenterUtils(this.userInputData)
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get locationButtonFormAction(): string {
    return this.availability.id
      ? `/referral/${this.referralId}/update-availability/${this.availability.id}`
      : `/add-availability/${this.referralId}`
  }

  get text() {
    return {
      checkboxes: {
        pageTitle: `When is ${this.personalDetails.name.forename} ${this.personalDetails.name.surname} available to attend a programme?`,
      },
      otherDetailsTextArea: {
        label: 'Other availability details (optional)',
      },
    }
  }

  generateCheckboxItems() {
    const checkboxes: { divider?: string; value?: string; text?: string; checked?: boolean }[] = []
    this.availability.availabilities.forEach(day => {
      checkboxes.push({
        divider: day.label,
      })
      day.slots.forEach(slot => {
        checkboxes.push({
          value: `${day.label}-${slot.label}`,
          text: slot.label,
          checked: slot.value,
        })
      })
    })
    return checkboxes
  }

  get fields() {
    let formattedEndDate = ''
    if (this.availability.endDate) {
      const [year, month, day] = this.availability.endDate.split('-')
      formattedEndDate = `${day}/${month}/${year}`
    }
    let endDateRequired = null
    if (this.availability.id) {
      endDateRequired = this.availability.endDate ? 'Yes' : 'No'
    }
    return {
      availabilityCheckboxes: {
        value: this.utils.stringValue(null, 'availability-checkboxes'),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'availability-checkboxes'),
      },
      otherDetailsTextArea: {
        value: this.utils.stringValue(this.availability.otherDetails, 'other-availability-details-text-area'),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'other-availability-details-text-area'),
      },
      endDateRequired: {
        value: this.utils.stringValue(endDateRequired, 'end-date'),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'end-date'),
      },
      endDate: {
        value: this.utils.stringValue(formattedEndDate, 'date'),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'date'),
      },
    }
  }
}
