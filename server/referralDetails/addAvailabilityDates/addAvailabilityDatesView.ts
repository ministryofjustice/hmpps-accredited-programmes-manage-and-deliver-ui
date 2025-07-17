import AddAvailabilityPresenter from './addAvailabilityDatesPresenter'

export default class AddAvailabilityDatesView {
  constructor(private readonly presenter: AddAvailabilityPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/addAvailability/addAvailabilityDates',
      {
        presenter: this.presenter,
      },
    ]
  }
}
