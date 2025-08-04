import { Availability, PersonalDetails } from '@manage-and-deliver-api'
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
      : `/referral/${this.referralId}/add-availability`
  }

  get text() {
    return {
      checkboxes: {
        pageTitle: `When is ${this.personalDetails.name} available to attend a programme?`,
      },
      otherDetailsTextArea: {
        label: 'Other availability details (optional)',
      },
    }
  }

  generateCheckboxItems() {
    // Remember the values selected if the page is re-created after form errors
    if (this.fields.availabilityCheckboxes.value !== '') {
      const selections = this.fields.availabilityCheckboxes.value.split(',').map(s => s.trim())
      selections.forEach(selection => {
        const [dayLabel, slotLabel] = selection.split('-')

        // Find the matching day
        const dayIndex = this.availability.availabilities.findIndex(
          day => day.label.toLowerCase() === dayLabel.toLowerCase(),
        )

        if (dayIndex !== -1) {
          // Find the matching slot within that day
          const slotIndex = this.availability.availabilities[dayIndex].slots.findIndex(
            slot => slot.label.toLowerCase() === slotLabel.toLowerCase(),
          )

          if (slotIndex !== -1) {
            // Set the value to true
            this.availability.availabilities[dayIndex].slots[slotIndex].value = true
          }
        }
      })
    }
    console.log(this.availability)
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
