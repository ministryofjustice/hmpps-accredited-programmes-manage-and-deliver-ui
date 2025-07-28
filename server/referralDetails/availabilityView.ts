import { ButtonArgs, InsetTextArgs } from '../utils/govukFrontendTypes'
import AvailabilityPresenter from './availabilityPresenter'

export default class AvailabilityView {
  constructor(private readonly presenter: AvailabilityPresenter) {}

  get importFromDeliusText(): InsetTextArgs {
    return {
      text: 'Imported from NDelius on 1 August 2023, last updated on 4 January 2023',
      classes: 'govuk-!-margin-top-0',
    }
  }

  get availabilityButtonArgs(): ButtonArgs {
    return {
      text: 'Add availability',
      href: this.presenter.availability.id
        ? `referral/${this.presenter.id}/update-availability/${this.presenter.availability.id}`
        : `/add-availability/${this.presenter.id}`,
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
      },
    ]
  }
}
