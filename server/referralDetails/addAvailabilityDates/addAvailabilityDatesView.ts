import AddAvailabilityPresenter from './addAvailabilityDatesPresenter'

export default class AddAvailabilityDatesView {
  constructor(
    private readonly presenter: AddAvailabilityPresenter,
    private readonly id: string,
  ) {}

  private backLinkArgs() {
    return {
      text: 'Back',
      href: `/add-availability/${this.id}`,
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/addAvailability/addAvailabilityDates',
      {
        presenter: this.presenter,
        backLinkArgs: this.backLinkArgs(),
        backlinkUri: `/add-availability/${this.id}`,
      },
    ]
  }
}
