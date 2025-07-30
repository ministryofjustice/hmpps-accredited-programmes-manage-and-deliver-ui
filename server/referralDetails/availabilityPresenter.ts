import { Availability, ReferralDetails } from '@manage-and-deliver-api'
import ReferralDetailsPresenter from './referralDetailsPresenter'

export default class AvailabilityPresenter extends ReferralDetailsPresenter {
  constructor(
    readonly details: ReferralDetails,
    readonly subNavValue: string,
    readonly id: string,
    readonly availability: Availability,
    readonly isAvailabilityUpdated: boolean | null = null,
  ) {
    super(details, subNavValue, id)
  }

  get showAvailability(): boolean {
    return this.availability.id !== null
  }

  getAvailabilityTableArgs() {
    // Get all the possible headings out of the object e.g. daytime, evening
    const uniqueSlotLabels = [
      ...new Set(this.availability.availabilities.flatMap(availability => availability.slots.map(slot => slot.label))),
    ]

    // Create a list of all the headings adding 'Day' of the first column - ['Day', 'daytime', 'evening']
    const headings = [{ text: 'Day' }]
    uniqueSlotLabels.forEach(slot => {
      headings.push({ text: slot.charAt(0).toUpperCase() + slot.slice(1) })
    })

    // Loop through the object and find the correct value true or false for every slot for every day and assign it the correct tag colour
    const rows: { html?: string; text?: string }[][] = []
    this.availability.availabilities.forEach(availability => {
      // Add the value for the Day column [{ text: 'Mondays' }]
      const row: { html?: string; text?: string }[] = [{ text: availability.label }]
      // Get the values for each slot
      uniqueSlotLabels.forEach(label => {
        const labelValue = availability.slots.find(slot => slot.label === label)?.value
        row.push({
          html: labelValue
            ? '<strong class="govuk-tag govuk-tag--green">available</strong>'
            : '<strong class="govuk-tag govuk-tag--red">not available</strong>',
        })
      })
      // At this point row will look something like [{ text: 'Mondays' }, { html: '<strong class="govuk-tag govuk-tag--green">available</strong>' }, { html: '<strong class="govuk-tag govuk-tag--red">not available</strong>'} ]
      rows.push(row)
    })

    return {
      caption: 'Dates and amounts',
      captionClasses: 'govuk-table__caption--m',
      firstCellIsHeader: true,
      head: headings,
      rows,
    }
  }
}
