import { ButtonArgs, InsetTextArgs } from '../utils/govukFrontendTypes'
import AvailabilityPresenter from './availabilityPresenter'
import DateUtils from '../utils/dateUtils'

export default class AvailabilityView {
  constructor(private readonly presenter: AvailabilityPresenter) {}

  get importFromDeliusText(): InsetTextArgs {
    return {
      text: `Last updated ${DateUtils.formattedDate(this.presenter.availability.lastModifiedAt)} by ${this.presenter.availability.lastModifiedBy}`,
      classes: 'govuk-!-margin-top-0',
    }
  }

  get generalAvailabilityText(): string {
    return this.presenter.availability.endDate
      ? `This is ${this.presenter.details.personName}'s general availability until ${DateUtils.formattedDate(this.presenter.availability.endDate)}.`
      : `This is ${this.presenter.details.personName}'s general availability to attend an Accredited Programme.`
  }

  get availabilityButtonArgs(): ButtonArgs {
    return {
      text: this.presenter.availability.id ? 'Change availability' : 'Add availability',
      href: this.presenter.availability.id
        ? `/referral/${this.presenter.id}/update-availability/${this.presenter.availability.id}`
        : `/referral/${this.presenter.id}/add-availability`,
    }
  }

  private successMessageArgs() {
    return {
      variant: 'success',
      title: 'Availability details added successfully.',
      showTitleAsHeading: true,
      dismissible: true,
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/referralDetails',
      {
        presenter: this.presenter,
        importFromDeliusText: this.importFromDeliusText,
        availabilityButtonArgs: this.availabilityButtonArgs,
        availability: this.presenter.availability,
        availabilityTableArgs: this.presenter.getAvailabilityTableArgs(),
        showAvailability: this.presenter.showAvailability,
        isAvailabilityUpdated: this.presenter.isAvailabilityUpdated,
        successMessageArgs: this.successMessageArgs(),
        generalAvailabilityText: this.generalAvailabilityText,
      },
    ]
  }
}
