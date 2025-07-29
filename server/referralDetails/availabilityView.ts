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

  get availabilityButtonArgs(): ButtonArgs {
    return {
      text: this.presenter.availability.id ? 'Change availability' : 'Add availability',
      href: this.presenter.availability.id
        ? `/referral/${this.presenter.id}/update-availability/${this.presenter.availability.id}`
        : `/add-availability/${this.presenter.id}`,
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
      },
    ]
  }
}
